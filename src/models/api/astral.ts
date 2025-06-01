import type { ComethLiteral, ComethType } from "./cometh.js"
import type { PolyanetLiteral, PolyanetType } from "./polyanet.js"
import type { SoloonLiteral, SoloonType } from "./soloon.js"
import type { SpaceLiteral, SpaceType } from "./space.js"

export type AstralLiteral = SpaceLiteral | PolyanetLiteral | SoloonLiteral | ComethLiteral
export type AstralType = SpaceType | PolyanetType | SoloonType | ComethType

export type Coordinates = {
    row: number
    col: number
}

export type RawAstralObject = {
    type: AstralType,
    [key: string]: any,
}
export interface AstralObject {
    type: AstralType
    coordinates?: Coordinates

    equal(obj: AstralObject): boolean
    toLiteral(): AstralLiteral

    add(): Promise<any>
    delete(): Promise<any>
}