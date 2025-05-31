import type { ComethLiteral, ComethType } from "./cometh.js"
import type { PolyanetLiteral, PolyanetType } from "./polyanet.js"
import type { SoloonLiteral, SoloonType } from "./soloon.js"
import type { SpaceLiteral, SpaceType } from "./space.js"

export type AstralLiteral = SpaceLiteral | PolyanetLiteral | SoloonLiteral | ComethLiteral
export type AstralType = SpaceType | PolyanetType | SoloonType | ComethType
export interface AstralObject {
    type: AstralType

    equal(obj: AstralObject): boolean
    toLiteral(): AstralLiteral
}