import axios from "../api/axios.js"
import type { AstralLiteral, AstralObject, AstralType, Coordinates } from "../models/api/astral.js"
import { Cometh, type ComethDirection } from "../models/api/cometh.js"
import type { LiteralMap, ObjectMap, RawObjectMap } from "../models/api/map.js"
import { Polyanet } from "../models/api/polyanet.js"
import { Soloon, type SoloonColor } from "../models/api/soloon.js"
import { Space } from "../models/api/space.js"
import { ChallengeError } from "../models/challenge-error.js"
import { ApiService } from "../services/api.service.js"
import { ComethService } from "../services/cometh.service.js"
import { MapService } from "../services/map.service.js"
import { PolyanetService } from "../services/polyanet.service.js"
import { SoloonService } from "../services/soloon.service.js"

export const SpaceObject: Space = new Space()
export const apiService = new ApiService(5, 1000, axios)
export const polyanetService = new PolyanetService(apiService)
export const soloonService = new SoloonService(apiService)
export const comethService = new ComethService(apiService)
export const mapService = new MapService(apiService)

export type BaseAstralObjectConfig = {
    candidateId: string,
    coordinates: Coordinates,
}

export type SpaceConfig = BaseAstralObjectConfig
export type PolyanetConfig = BaseAstralObjectConfig
export type SoloonConfig = BaseAstralObjectConfig & {
    color: SoloonColor,
}
export type ComethConfig = BaseAstralObjectConfig & {
    direction: ComethDirection,
}

export type AstralObjectConfig = SpaceConfig | PolyanetConfig | SoloonConfig | ComethConfig

export type RegistryFactory = { [typeKey in AstralLiteral | AstralType]: (payload: AstralObjectConfig) => AstralObject }

export const registry: RegistryFactory = {
    "SPACE": () => SpaceObject,
    "-1": () => SpaceObject,
    "POLYANET": (payload) => {
        return new Polyanet(payload.candidateId, payload.coordinates, polyanetService)
    },
    "0": (payload) => { // Polyanet object
        return new Polyanet(payload.candidateId, payload.coordinates, polyanetService)
    }, 
    "BLUE_SOLOON": (payload) => {
        return new Soloon("blue", payload.candidateId, payload.coordinates, soloonService)
    },
    "RED_SOLOON": (payload) => {
        return new Soloon("red", payload.candidateId, payload.coordinates, soloonService)
    },
    "PURPLE_SOLOON": (payload) => {
        return new Soloon("purple", payload.candidateId, payload.coordinates, soloonService)
    },
    "WHITE_SOLOON": (payload) => {
        return new Soloon("white", payload.candidateId, payload.coordinates, soloonService)
    },
    "1": (payload) => { // Soloon object
        if (!('color' in payload)) {
            throw new ChallengeError('Color is required for Soloon objects')
        }
        return new Soloon(payload.color, payload.candidateId, payload.coordinates, soloonService)
    },
    "UP_COMETH": (payload) => {
        return new Cometh("up", payload.candidateId, payload.coordinates, comethService)
    },
    "DOWN_COMETH": (payload) => {
        return new Cometh("down", payload.candidateId, payload.coordinates, comethService)
    },
    "LEFT_COMETH": (payload) => {
        return new Cometh("left", payload.candidateId, payload.coordinates, comethService)
    },
    "RIGHT_COMETH": (payload) => {
        return new Cometh("right", payload.candidateId, payload.coordinates, comethService)
    },
    "2": (payload) => { // Cometh object
        if (!('direction' in payload)) {
            throw new ChallengeError('Direction is required for Cometh objects')
        }
        return new Cometh(payload.direction, payload.candidateId, payload.coordinates, comethService)
    },
}

export function createAstralObjectMap(map: LiteralMap | RawObjectMap, candidateId: string): ObjectMap {
    return map.map((row, i) => row.map((cell, j) => {
        const baseConfig: BaseAstralObjectConfig = {
            candidateId: candidateId,
            coordinates: { row: i, col: j }
        }
        
        // If cell is a string, it's an AstralLiteral
        if (typeof cell === 'string') {
            return createAstralObject(cell, baseConfig)
        }
        
        // it's a RawAstralObject
        if (cell) {
            const { type, ...payload } = cell
            return createAstralObject(type, { ...baseConfig, ...payload })
        }
        
        // Default to space if cell is null/undefined
        return createAstralObject(cell, baseConfig)
    }))
}

export function createAstralObject(key: AstralLiteral | AstralType, payload: AstralObjectConfig): AstralObject {
    if (key == null) {
        return registry["SPACE"](payload)
    }

    const builder = registry[key]
    if (!builder) {
        throw new ChallengeError(`Unknown Astral type: ${key}`)
    }

    return builder(payload)
}

export function delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestWithRetry<T>(fn: () => Promise<T>, retries = 5, backoff = 1000): Promise<PromiseSettledResult<T>> {
    try {
        const response = await fn()
        return { status: 'fulfilled', value: response }
    } catch (error: any) {
        if (retries > 0 && error.response?.status === 429) {
            // delay before requesting again
            await delay(backoff)

            // trye
            return requestWithRetry(fn, retries - 1, backoff * 2)
        } else {
            return { status: 'rejected', reason: error }
        }
    }
}