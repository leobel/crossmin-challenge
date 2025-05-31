import type { AstralObject, AstralType } from "./astral.js"

export const POLYANET_TYPE = 0
export type PolyanetType = typeof POLYANET_TYPE
export type PolyanetLiteral = "POLYANET"

export function isPolyanet(item: AstralObject): item is Polyanet {
    return item.type === POLYANET_TYPE
}
export class Polyanet implements AstralObject { 
    // type: 0
    type: AstralType
    
    constructor() {
       this.type = POLYANET_TYPE
    }

    equal(obj: AstralObject): boolean {
        return isPolyanet(obj)
    }

    toLiteral(): PolyanetLiteral {
        return "POLYANET"
    }
}