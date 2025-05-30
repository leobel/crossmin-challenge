import type { GoalMap } from "./models/api/goal-map"
import { addPolyanet, deletePolyanet, getMap } from "./services/api"
import { isPolyanet, requestWithRetry } from "./utils"

export async function buildCrossPolyanets(candidateId: string, goalMap: GoalMap): Promise<boolean> {
    const map = goalMap.goal
    const currentMap = (await getMap(candidateId)).map.content
    const actions: Promise<any>[] = []
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (isPolyanet(map[i][j])) {
                if (!isPolyanet(currentMap[i][j])) {
                    actions.push(requestWithRetry(() => addPolyanet(candidateId, i, j)))
                }
            } else if (isPolyanet(currentMap[i][j])) { // only delete if POLYANET
                actions.push(requestWithRetry(() => deletePolyanet(candidateId, i, j)))
            }
        }
    }

    const result = await Promise.allSettled(actions)
    return result.every(r => r.status === 'fulfilled')
}