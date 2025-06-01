import type { AstralObject } from "./models/api/astral.js"
import type { ObjectMap } from "./models/api/map.js"

export default class Megaverse {
    constructor(readonly candidateId: string) { }

    async build(goalMap: ObjectMap, candidateMap: ObjectMap): Promise<ObjectMap> {
        const result: ObjectMap = candidateMap.map(r => r)
        for (let i = 0; i < goalMap.length; i++) {
            for (let j = 0; j < goalMap[i].length; j++) {
                const goalObj = goalMap[i][j]
                const obj = candidateMap[i][j]
                if (!goalObj.equal(obj)) {
                    // delete current obj
                    await this.delete(obj)

                    // add goal obj
                    await this.add(goalObj)
                }
                result[i][j] = goalObj
            }
        }
        return result
    }

    private async add(obj: AstralObject): Promise<any> {
        if (!obj) return
        return obj.add()
    }

    private async delete(obj: AstralObject): Promise<any> {
        if (!obj) return
        return obj.delete()
    }
}