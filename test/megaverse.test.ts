import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import Megaverse from '../src/megaverse.js';
import { Polyanet } from '../src/models/api/polyanet.js';
import { Soloon } from '../src/models/api/soloon.js';
import { Cometh } from '../src/models/api/cometh.js';
import { SpaceObject } from '../src/utils/index.js';
import { Space } from '../src/models/api/space.js';
import type { IPolyanetService } from '../src/services/polyanet.service.js';
import type { ISoloonService } from '../src/services/soloon.service.js';
import type { IComethService } from '../src/services/cometh.service.js';
import type { ObjectMap } from '../src/models/api/map.js';

describe('Megaverse', () => {
    const mockPolyanetService = {
        add: jest.fn(),
        delete: jest.fn()
    } as IPolyanetService;

    const mockSoloonService = {
        add: jest.fn(),
        delete: jest.fn()
    } as ISoloonService;

    const mockComethService = {
        add: jest.fn(),
        delete: jest.fn()
    } as IComethService;

    const megaverse = new Megaverse('test-candidate');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should build empty map correctly', async () => {
        const goalMap: ObjectMap = [
            [SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject]
        ];
        const candidateMap = [
            [SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject]
        ];

        const result = await megaverse.build(goalMap, candidateMap);

        expect(result).toEqual(candidateMap);
        expect(mockPolyanetService.add).not.toHaveBeenCalled();
        expect(mockSoloonService.add).not.toHaveBeenCalled();
        expect(mockComethService.add).not.toHaveBeenCalled();
    });

    test('should add new objects to empty map', async () => {
        const goalMap: ObjectMap = [
            [new Polyanet(megaverse.candidateId, { row: 0, col: 0 }, mockPolyanetService), new Soloon('red', megaverse.candidateId, { row: 0, col: 1 }, mockSoloonService)],
            [new Cometh('up', megaverse.candidateId, { row: 1, col: 0 }, mockComethService), SpaceObject]
        ];
        const candidateMap = [
            [SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject]
        ];

        const result = await megaverse.build(goalMap, candidateMap);

        expect(result[0][0]).toBeInstanceOf(Polyanet);
        expect(result[0][1]).toBeInstanceOf(Soloon);
        expect(result[1][0]).toBeInstanceOf(Cometh);
        expect(result[1][1]).toBe(SpaceObject);

        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 0, 0);
        expect(mockSoloonService.add).toHaveBeenCalledWith(megaverse.candidateId, 0, 1, 'red');
        expect(mockComethService.add).toHaveBeenCalledWith(megaverse.candidateId, 1, 0, 'up');
    });

    test('should replace existing objects with new ones', async () => {
        const goalMap: ObjectMap = [
            [new Polyanet(megaverse.candidateId, { row: 0, col: 0 }, mockPolyanetService), new Soloon('blue', megaverse.candidateId, { row: 0, col: 1 }, mockSoloonService)],
            [new Cometh('down', megaverse.candidateId, { row: 1, col: 0 }, mockComethService), SpaceObject]
        ];
        const candidateMap = [
            [new Soloon('red', megaverse.candidateId, { row: 0, col: 0 }, mockSoloonService), new Polyanet(megaverse.candidateId, { row: 0, col: 1 }, mockPolyanetService)],
            [new Cometh('up', megaverse.candidateId, { row: 1, col: 0 }, mockComethService), SpaceObject]
        ];

        const result = await megaverse.build(goalMap, candidateMap);

        expect(result[0][0]).toBeInstanceOf(Polyanet);
        expect(result[0][1]).toBeInstanceOf(Soloon);
        expect(result[1][0]).toBeInstanceOf(Cometh);
        expect(result[1][1]).toBe(SpaceObject);

        // Verify deletions
        expect(mockSoloonService.delete).toHaveBeenCalledWith(megaverse.candidateId, 0, 0);
        expect(mockPolyanetService.delete).toHaveBeenCalledWith(megaverse.candidateId, 0, 1);
        expect(mockComethService.delete).toHaveBeenCalledWith(megaverse.candidateId, 1, 0);

        // Verify additions
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 0, 0);
        expect(mockSoloonService.add).toHaveBeenCalledWith(megaverse.candidateId, 0, 1, 'blue');
        expect(mockComethService.add).toHaveBeenCalledWith(megaverse.candidateId, 1, 0, 'down');
    });

    test('should handle cross correctly', async () => {
        const goalMap: ObjectMap = [
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 2, col: 2 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 2, col: 8 }, mockPolyanetService), SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 3, col: 3 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 3, col: 7 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 4, col: 4 }, mockPolyanetService), SpaceObject, new Polyanet(megaverse.candidateId, { row: 4, col: 6 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 5, col: 5 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 6, col: 4 }, mockPolyanetService), SpaceObject, new Polyanet(megaverse.candidateId, { row: 6, col: 6 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 7, col: 3 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 7, col: 7 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 8, col: 2 }, mockPolyanetService), SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, new Polyanet(megaverse.candidateId, { row: 8, col: 8 }, mockPolyanetService), SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject],
            [SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject, SpaceObject]
        ];

        // Create an empty candidate map
        const candidateMap = Array(11).fill(null).map(() =>
            Array(11).fill(SpaceObject)
        );

        const result = await megaverse.build(goalMap, candidateMap);

        // Verify some key positions in the result
        expect(result[2][2]).toBeInstanceOf(Polyanet);
        expect(result[3][3]).toBeInstanceOf(Polyanet);
        expect(result[4][4]).toBeInstanceOf(Polyanet);
        expect(result[5][5]).toBeInstanceOf(Polyanet);
        expect(result[6][6]).toBeInstanceOf(Polyanet);
        expect(result[7][7]).toBeInstanceOf(Polyanet);
        expect(result[8][8]).toBeInstanceOf(Polyanet);
        expect(result[2][8]).toBeInstanceOf(Polyanet);
        expect(result[3][7]).toBeInstanceOf(Polyanet);
        expect(result[4][6]).toBeInstanceOf(Polyanet);
        expect(result[6][4]).toBeInstanceOf(Polyanet);
        expect(result[7][3]).toBeInstanceOf(Polyanet);
        expect(result[8][2]).toBeInstanceOf(Polyanet);

        // Verify service calls for some key positions
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 2, 2);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 3, 3);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 4, 4);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 5, 5);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 6, 6);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 7, 7);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 8, 8);

        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 2, 8);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 3, 7);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 4, 6);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 6, 4);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 7, 3);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 8, 2);
    });

    test('should handle crossmint logo correctly', async () => {
        const literalMatrix = [
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "BLUE_SOLOON", "POLYANET", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH"],
            ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "WHITE_SOLOON", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "RED_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "BLUE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "PURPLE_SOLOON", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "BLUE_SOLOON", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "DOWN_COMETH", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "POLYANET", "POLYANET", "WHITE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "PURPLE_SOLOON", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "WHITE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "WHITE_SOLOON", "POLYANET", "POLYANET", "PURPLE_SOLOON", "SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "POLYANET", "SPACE", "RED_SOLOON", "POLYANET", "POLYANET", "BLUE_SOLOON", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "POLYANET", "RED_SOLOON", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "POLYANET", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "POLYANET", "POLYANET", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "DOWN_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "UP_COMETH", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "RIGHT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "LEFT_COMETH", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"],
            ["SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE", "SPACE"]
        ];
        const goalMap = convertToAstralObjectMatrix(literalMatrix, megaverse, mockPolyanetService, mockSoloonService, mockComethService, SpaceObject);

        // Create an empty candidate map
        const candidateMap = Array(30).fill(null).map(() =>
            Array(30).fill(SpaceObject)
        );

        const result = await megaverse.build(goalMap, candidateMap);

        // Verify some key positions in the result
        expect(result[2][2]).toBeInstanceOf(Polyanet);
        expect(result[2][3]).toBeInstanceOf(Polyanet);
        expect(result[1][7]).toBeInstanceOf(Cometh);
        expect(result[4][5]).toBeInstanceOf(Soloon);
        expect(result[4][8]).toBeInstanceOf(Soloon);
        expect(result[3][21]).toBeInstanceOf(Polyanet);
        expect(result[3][22]).toBeInstanceOf(Polyanet);
        expect(result[3][23]).toBeInstanceOf(Space);
        expect(result[3][24]).toBeInstanceOf(Polyanet);

        // Verify service calls for some key positions
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 2, 2);
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 2, 3);
        expect(mockComethService.add).toHaveBeenCalledWith(megaverse.candidateId, 1, 7, 'right');
        expect(mockSoloonService.add).toHaveBeenCalledWith(megaverse.candidateId, 4, 5, 'blue');
        expect(mockSoloonService.add).toHaveBeenCalledWith(megaverse.candidateId, 4, 8, 'purple');
        expect(mockPolyanetService.add).toHaveBeenCalledWith(megaverse.candidateId, 3, 21);
    });
});

// Helper function to convert literal matrix to AstralObject matrix
function convertToAstralObjectMatrix(matrix: string[][], megaverse: any, mockPolyanetService: any, mockSoloonService: any, mockComethService: any, SpaceObject: any) {
    return matrix.map((row, i) =>
        row.map((cell, j) => {
            switch (cell) {
                case 'SPACE':
                    return SpaceObject;
                case 'POLYANET':
                    return new Polyanet(megaverse.candidateId, { row: i, col: j }, mockPolyanetService);
                case 'RED_SOLOON':
                    return new Soloon('red', megaverse.candidateId, { row: i, col: j }, mockSoloonService);
                case 'BLUE_SOLOON':
                    return new Soloon('blue', megaverse.candidateId, { row: i, col: j }, mockSoloonService);
                case 'PURPLE_SOLOON':
                    return new Soloon('purple', megaverse.candidateId, { row: i, col: j }, mockSoloonService);
                case 'WHITE_SOLOON':
                    return new Soloon('white', megaverse.candidateId, { row: i, col: j }, mockSoloonService);
                case 'UP_COMETH':
                    return new Cometh('up', megaverse.candidateId, { row: i, col: j }, mockComethService);
                case 'DOWN_COMETH':
                    return new Cometh('down', megaverse.candidateId, { row: i, col: j }, mockComethService);
                case 'LEFT_COMETH':
                    return new Cometh('left', megaverse.candidateId, { row: i, col: j }, mockComethService);
                case 'RIGHT_COMETH':
                    return new Cometh('right', megaverse.candidateId, { row: i, col: j }, mockComethService);
                default:
                    throw new Error(`Unknown cell type: ${cell}`);
            }
        })
    );
}