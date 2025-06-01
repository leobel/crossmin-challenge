import type { ISoloonService } from "../../services/soloon.service.js";
import type { AstralObject, AstralType, Coordinates } from "./astral.js";

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
    
    constructor(
        readonly color: SoloonColor,
        readonly candidateId: string,
        readonly coordinates: Coordinates,
        readonly service: ISoloonService,
    ) {
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

    add(): Promise<any> {
        return this.service.add(this.candidateId, this.coordinates.row, this.coordinates.col, this.color)
    }

    delete(): Promise<any> {
        return this.service.delete(this.candidateId, this.coordinates.row, this.coordinates.col)
    }
}