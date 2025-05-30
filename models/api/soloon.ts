import type { AstralObject } from "./astral";

export type SoloonColor = "blue" | "red" | "purple" | "white"

export type Soloon = AstralObject & { type: 1, color: SoloonColor }