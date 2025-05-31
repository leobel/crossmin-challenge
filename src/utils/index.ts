import { Space } from "../models/api/space.js"

export const SpaceObject: Space = new Space()

export function delay(ms = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestWithRetry<T>(fn: () => Promise<T>, retries = 5, backoff = 1000): Promise<PromiseSettledResult<T>> {
    try {
        const response = await fn()
        return { status: 'fulfilled', value: response }
    } catch (error: any) {
        if (retries > 0 && error.response?.status === 429) {
            // delay before requesting again
            await delay(backoff)
            
            // trye
            return requestWithRetry(fn, retries - 1, backoff * 2)
        } else {
            return { status: 'rejected', reason: error }
        }
    }
}