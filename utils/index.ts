import type { AstralLiteral, AstralObject } from "../models/api/astral"
import type { Cometh } from "../models/api/cometh"
import type { Polyanet } from "../models/api/polyanet"
import type { Soloon } from "../models/api/soloon"
import type { Space } from "../models/api/space"
import { addCometh, addPolyanet, addSoloon, deleteCometh, deletePolyanet, deleteSoloon } from "../services/api"

export function delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestWithRetry(fn: () => Promise<any>, retries = 5, backoff = 1000) {
    try {
        const response = await fn()
        return { status: 'fulfilled', value: response.data }
    } catch (error) {
        if (retries > 0 && error.response && error.response.status === 429) {
            // Wait for backoff duration before retrying
            await delay(backoff)
            // Retry with increased backoff
            return requestWithRetry(fn, retries - 1, backoff * 2)
        } else {
            return { status: 'rejected', reason: error }
        }
    }
}

export const SpaceObject: Space = { name: "SPACE", type: -1 }

export function mapAstralLiteralToAstralObject(item: AstralLiteral): AstralObject {
    switch (item) {
        case "SPACE":
            return { name: item, type: -1 } // Assuming -1 represents SPACE
        case "POLYANET":
            return { name: item, type: 0 }
        case "BLUE_SOLOON":
            return { name: item, type: 1, color: "blue" } as Soloon
        case "RED_SOLOON":
            return { name: item, type: 1, color: "red" } as Soloon
        case "PURPLE_SOLOON":
            return { name: item, type: 1, color: "purple" } as Soloon
        case "WHITE_SOLOON":
            return { name: item, type: 1, color: "white" } as Soloon
        case "UP_COMETH":
            return { name: item, type: 2, direction: "up" } as Cometh
        case "DOWN_COMETH":
            return { name: item, type: 2, direction: "down" } as Cometh
        case "RIGHT_COMETH":
            return { name: item, type: 2, direction: "right" } as Cometh
        case "LEFT_COMETH":
            return { name: item, type: 2, direction: "left" } as Cometh
        default:
            throw new Error(`Unknown AstralLiteral: ${item}`)
    }
}

export function isSpace(item: AstralObject): item is Space {
    return item.type === -1
}

export function isPolyanet(item: AstralObject): item is Polyanet {
    return item.type === 0
}

export function isSoloon(obj: AstralObject): obj is Soloon {
    return obj.type === 1 && "color" in obj
}

export function isCometh(obj: AstralObject): obj is Cometh {
    return obj.type === 2 && "direction" in obj;
}

export function areAstralObjectsEqual(a: AstralObject, b: AstralObject): boolean {
    if (isSpace(a) && isSpace(b)) {
        return true;
    }

    if (isPolyanet(a) && isPolyanet(b)) {
        return true;
    }

    if (isSoloon(a) && isSoloon(b)) {
        return a.color === b.color;
    }

    if (isCometh(a) && isCometh(b)) {
        return a.direction === b.direction;
    }

    return false;
}

export function addAstralObject(obj: AstralObject, candidateId: string, row: number, col: number): Promise<void> {
    if (isPolyanet(obj)) {
        return addPolyanet(candidateId, row, col)
    }

    if (isSoloon(obj)) {
        return addSoloon(candidateId, row, col, obj)
    }

    if (isCometh(obj)) {
        return addCometh(candidateId, row, col, obj)
    }

    throw new Error(`Invalid astral object: ${obj}`)
}   

export function deleteAstralObject(obj: AstralObject, candidateId: string, row: number, col: number): Promise<void> {
    if (isPolyanet(obj)) {
        return deletePolyanet(candidateId, row, col)
    }

    if (isSoloon(obj)) {
        return deleteSoloon(candidateId, row, col)
    }

    if (isCometh(obj)) {
        return deleteCometh(candidateId, row, col)
    }

    throw new Error(`Invalid astral object: ${obj}`)
}