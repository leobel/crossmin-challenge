import type { CandidateMap, GoalMap, LiteralMap, ObjectMap } from "../models/api/map.js"
import type { IApiService } from "./api.service.js"

export interface IMapService {
    getCandidateMap(candidateId: string): Promise<ObjectMap>
    getGoalMap(candidateId: string): Promise<LiteralMap>
}

export class MapService implements IMapService {

    constructor(readonly apiService: IApiService) { }

    async getCandidateMap(candidateId: string): Promise<ObjectMap> {
        const response = await this.apiService.getRequest<CandidateMap>(`/map/${candidateId}`)
        return response.map.content
    }

    async getGoalMap(candidateId: string): Promise<LiteralMap> {
        const response = await this.apiService.getRequest<GoalMap>(`/map/${candidateId}/goal`)
        return response.goal
    }

}