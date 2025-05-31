import type { AstralObject } from "./astral.js";

export type SoloonColor = "blue" | "red" | "purple" | "white"

export type Soloon = AstralObject & { type: 1, color: SoloonColor }