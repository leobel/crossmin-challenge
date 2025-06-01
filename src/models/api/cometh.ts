import type { IComethService } from "../../services/cometh.service.js"
import type { AstralObject, AstralType, Coordinates } from "./astral.js"

export const COMETH_TYPE = 2
export type ComethType = typeof COMETH_TYPE
export type ComethLiteral = "UP_COMETH" | "DOWN_COMETH" | "RIGHT_COMETH" | "LEFT_COMETH"
export type ComethDirection = "up" | "down" | "right" | "left"

export function isCometh(obj: AstralObject): obj is Cometh {
    return obj.type === COMETH_TYPE && "direction" in obj;
}
export class Cometh implements AstralObject { 
    // type: 2
    type: AstralType
    
    constructor(
        readonly direction: ComethDirection,
        readonly candidateId: string,
        readonly coordinates: Coordinates,
        readonly service: IComethService,
    ) {
       this.type = COMETH_TYPE
    }

    equal(obj: AstralObject): boolean {
        return isCometh(obj) && obj.direction === this.direction
    }

    toLiteral(): ComethLiteral {
        switch (this.direction) {
            case "up":
                return "UP_COMETH"
            case "down":
                return "DOWN_COMETH"
            case "left":
                return "LEFT_COMETH"
            case "right":
                return "RIGHT_COMETH"
        }
    }

    add(): Promise<any> {
        return this.service.add(this.candidateId, this.coordinates.row, this.coordinates.col, this.direction)
    }

    delete(): Promise<any> {
        return this.service.delete(this.candidateId, this.coordinates.row, this.coordinates.col)
    }
}