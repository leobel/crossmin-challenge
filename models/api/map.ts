import type { AstralObject } from "./astral"

export interface Map {
    map: InnerMap
}

interface InnerMap {
    _id: string
    content: AstralObject[][]
}