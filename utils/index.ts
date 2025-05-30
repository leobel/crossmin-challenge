import type { Astral } from "../models/api/astral-object"

export function delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestWithRetry(fn: () => Promise<any>, retries = 5, backoff = 1000) {
    try {
        const response = await fn()
        return { status: 'fulfilled', value: response.data }
    } catch (error) {
        if (retries > 0 && error.response && error.response.status === 429) {
            // Wait for backoff duration before retrying
            await delay(backoff)
            // Retry with increased backoff
            return requestWithRetry(fn, retries - 1, backoff * 2)
        } else {
            return { status: 'rejected', reason: error }
        }
    }
}

export function isPolyanet(item: Astral): boolean {
    if (!item) return false
    if (typeof item === "string") {
        return item === "POLYANET"
    }
    return item.type === 0
}