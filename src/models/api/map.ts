import type { AstralObject } from "./astral.js"

export interface Map {
    map: InnerMap
}

interface InnerMap {
    _id: string
    content: AstralObject[][]
}