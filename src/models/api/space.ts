import type { AstralObject, AstralType } from "./astral.js";

export const SPACE_TYPE = -1
export type SpaceType = typeof SPACE_TYPE
export type SpaceLiteral = "SPACE"

export function isSpace(item: AstralObject): item is Space {
    return item.type === SPACE_TYPE
}
export class Space implements AstralObject { 
    // type: -1
    type: AstralType
    
    constructor() {
       this.type = SPACE_TYPE
    }

    equal(obj: AstralObject): boolean {
        return isSpace(obj)
    }

    toLiteral(): SpaceLiteral {
        return "SPACE"
    }

    async add(): Promise<any> {
        return
    }

    async delete(): Promise<any> {
        return
    }
}