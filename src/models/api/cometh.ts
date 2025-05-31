import type { AstralObject } from "./astral.js";

export type ComethDirection = "up" | "down" | "right" | "left"
export type Cometh = AstralObject & { type: 2, direction: ComethDirection }