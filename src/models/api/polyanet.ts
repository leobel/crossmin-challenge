import type { IPolyanetService } from "../../services/polyanet.service.js"
import type { AstralObject, AstralType, Coordinates } from "./astral.js"

export const POLYANET_TYPE = 0
export type PolyanetType = typeof POLYANET_TYPE
export type PolyanetLiteral = "POLYANET"

export function isPolyanet(item: AstralObject): item is Polyanet {
    return item.type === POLYANET_TYPE
}
export class Polyanet implements AstralObject { 
    // type: 0
    type: AstralType
    
    constructor(
        readonly candidateId: string,
        readonly coordinates: Coordinates,
        readonly service: IPolyanetService,
    ) {
       this.type = POLYANET_TYPE
    }

    equal(obj: AstralObject): boolean {
        return isPolyanet(obj)
    }

    toLiteral(): PolyanetLiteral {
        return "POLYANET"
    }

    add(): Promise<any> {
        return this.service.add(this.candidateId, this.coordinates.row, this.coordinates.col)
    }

    delete(): Promise<any> {
        return this.service.delete(this.candidateId, this.coordinates.row, this.coordinates.col)
    }
}