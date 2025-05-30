import type { Astral } from "./astral-object"

export interface Map {
    map: InnerMap
}

interface InnerMap {
    _id: string
    content: Astral[][]
}