import type { AstralObject, AstralType } from "./astral.js";

export const SOLOON_TYPE = 1
export type SoloonType = typeof SOLOON_TYPE
export type SoloonLiteral = "BLUE_SOLOON" | "RED_SOLOON" | "PURPLE_SOLOON" | "WHITE_SOLOON"
export type SoloonColor = "blue" | "red" | "purple" | "white"

export function isSoloon(obj: AstralObject): obj is Soloon {
    return obj.type === SOLOON_TYPE && "color" in obj
}
export class Soloon implements AstralObject { 
    // type: 1
    type: AstralType
    
    constructor(readonly color: SoloonColor) {
       this.type = SOLOON_TYPE
    }

    equal(obj: AstralObject): boolean {
        return isSoloon(obj) && obj.color === this.color
    }

    toLiteral(): SoloonLiteral {
        switch (this.color) {
            case "blue":
                return "BLUE_SOLOON"
            case "red":
                return "RED_SOLOON"
            case "purple":
                return "PURPLE_SOLOON"
            case "white":
                return "WHITE_SOLOON"
        }
    }
}