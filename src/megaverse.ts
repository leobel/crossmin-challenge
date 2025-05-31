import type { AstralLiteral, AstralObject } from "./models/api/astral.js"
import type { LiteralMap, ObjectMap } from "./models/api/map.js"
import type { IComethService } from "./services/cometh.service.js"
import type { IPolyanetService } from "./services/polyanet.service.js"
import type { ISoloonService } from "./services/soloon.service.js"
import { isPolyanet, Polyanet } from "./models/api/polyanet.js"
import { isSoloon, Soloon } from "./models/api/soloon.js"
import { isCometh, Cometh } from "./models/api/cometh.js"
import { ChallengeError } from "./models/challenge-error.js"
import { SpaceObject } from "./utils/index.js"
import { isSpace } from "./models/api/space.js"

export default class Megaverse {
    constructor(
        readonly candidateId: string,
        readonly polyanetService: IPolyanetService,
        readonly soloonService: ISoloonService,
        readonly comethService: IComethService
    ) {}    

    async build(goalMap: LiteralMap, candidateMap: ObjectMap): Promise<ObjectMap> {
        const result = candidateMap.map(r => r)
        for (let i = 0; i < goalMap.length; i++) {
            for (let j = 0; j < goalMap[i].length; j++) {
                const goalObj = this.mapFromLiteral(goalMap[i][j])
                const obj = this.mapFromObject(candidateMap[i][j])
                if (!goalObj.equal(obj)) {
                    // delete current obj
                    await this.delete(obj, i, j)

                    // add goal obj
                    await this.add(goalObj, i, j)
                }
                result[i][j] = goalObj
            }
        }
        return result
    }

    private async add(obj: AstralObject, row: number, col: number): Promise<any> {
        if (!obj) return 
        if (obj instanceof Polyanet) {
            return this.polyanetService.add(this.candidateId, row, col)
        }
        if (obj instanceof Soloon) {
            return this.soloonService.add(this.candidateId, row, col, obj.color)
        }
        if (obj instanceof Cometh) {
            return this.comethService.add(this.candidateId, row, col, obj.direction)
        }
    }

    private async delete(obj: AstralObject, row: number, col: number): Promise<any> {
        if (!obj) return 
        if (obj instanceof Polyanet) {
            return this.polyanetService.delete(this.candidateId, row, col)
        }
        if (obj instanceof Soloon) {
            return this.soloonService.delete(this.candidateId, row, col)
        }
        if (obj instanceof Cometh) {
            return this.comethService.delete(this.candidateId, row, col)
        }
    }

    private mapFromObject(obj: AstralObject): AstralObject {
        if (!obj || isSpace(obj)) return SpaceObject
        if (isPolyanet(obj)) {
            return new Polyanet()
        }
        if (isSoloon(obj)) {
            return new Soloon(obj.color)
        }
        if (isCometh(obj)) {
            return new Cometh(obj.direction)
        }
       
        throw new ChallengeError(`Unknown AstralObject`, obj)
    }

    private mapFromLiteral(item: AstralLiteral): AstralObject {
        switch (item) {
            case "SPACE":
                return SpaceObject
            case "POLYANET":
                return new Polyanet()
            case "BLUE_SOLOON":
                return new Soloon("blue")
            case "RED_SOLOON":
                return new Soloon("red")
            case "PURPLE_SOLOON":
                return new Soloon("purple")
            case "WHITE_SOLOON":
                return new Soloon("white")
            case "UP_COMETH":
                return new Cometh("up")
            case "DOWN_COMETH":
                return new Cometh("down")
            case "RIGHT_COMETH":
                return new Cometh("right")
            case "LEFT_COMETH":
                return new Cometh("left")
            default:
                throw new ChallengeError(`Unknown AstralLiteral`, item)
        }
    }
}