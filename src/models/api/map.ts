import type { AstralLiteral, AstralObject, RawAstralObject } from "./astral.js"


export type RawObjectMap = RawAstralObject[][]
export type ObjectMap = AstralObject[][]
export type LiteralMap = AstralLiteral[][]
export interface CandidateMap {
    map: InnerMap
}

export interface GoalMap {
    goal: LiteralMap
}

interface InnerMap {
    _id: string
    content: ObjectMap
}