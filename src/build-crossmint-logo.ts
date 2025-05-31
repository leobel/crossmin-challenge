import type { GoalMap } from "./models/api/goal-map.js"
import { ChallengeError } from "./models/challenge-error.js"
import { getMap } from "./services/api.js"
import { addObject, objectsEqual, deleteObject, mapLiteralToObject, requestWithRetry, SpaceObject } from "./utils/index.js"

export async function buildMintLogo(candidateId: string, goalMap: GoalMap, retries = 5, backoff = 1000): Promise<void> {
    const map = goalMap.goal
    const currentMap = (await getMap(candidateId)).map.content
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const goalObj = mapLiteralToObject(map[i][j])
            const obj = currentMap[i][j] || SpaceObject
            if (!objectsEqual(goalObj, obj)) {
                // delete current obj
                let response = await requestWithRetry(() => deleteObject(obj, candidateId, i, j), retries, backoff)
                if (response.status === "rejected") {
                    throw new ChallengeError('Something went wrong', response.reason)
                }

                // add goal obj
                response = await requestWithRetry(() => addObject(goalObj, candidateId, i, j), retries, backoff)
                if (response.status === "rejected") {
                    throw new ChallengeError('Something went wrong', response.reason)
                }
            }
        }
    }
}