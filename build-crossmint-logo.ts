import type { GoalMap } from "./models/api/goal-map"
import { getMap } from "./services/api"
import { addAstralObject, areAstralObjectsEqual, deleteAstralObject, mapAstralLiteralToAstralObject, requestWithRetry, SpaceObject } from "./utils"

export async function buildMintLogo(candidateId: string, goalMap: GoalMap): Promise<boolean> {
    const map = goalMap.goal
    const currentMap = (await getMap(candidateId)).map.content
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            const goalObj = mapAstralLiteralToAstralObject(map[i][j])
            const obj = currentMap[i][j] || SpaceObject
            if (!areAstralObjectsEqual(goalObj, obj)) {
                // delete current obj
                await requestWithRetry(() => deleteAstralObject(obj, candidateId, i, j))

                // add goal obj
                await requestWithRetry(() => addAstralObject(goalObj, candidateId, i, j))
            }
        }
    }

    return true
}