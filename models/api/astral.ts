export type Astral = AstralLiteral | AstralObject
export type AstralLiteral = "SPACE" | "POLYANET" | "BLUE_SOLOON" | "RED_SOLOON" | "PURPLE_SOLOON" | "WHITE_SOLOON" | "UP_COMETH" | "DOWN_COMETH" | "RIGHT_COMETH" | "LEFT_COMETH"
export type AstralType = SpaceType | PolyanetType | SoloonType | ComethType
export type SpaceType = -1
export type PolyanetType = 0
export type SoloonType = 1
export type ComethType = 2
export interface AstralObject {
    name: AstralLiteral
    type: AstralType
}