import type { ComethDirection } from "../models/api/cometh.js"
import { IApiService } from "./api.service.js"

export interface IComethService {
    add(candidateId: string, row: number, col: number, direction: ComethDirection): Promise<any>
    delete(candidateId: string, row: number, col: number): Promise<any>
}

export class ComethService implements IComethService {

    constructor(readonly apiService: IApiService) {}
    
    add(candidateId: string, row: number, col: number, direction: ComethDirection): Promise<any> {
        return this.apiService.addRequest(`/comeths`, {
            candidateId: candidateId,
            row: row,
            column: col,
            direction: direction
        })
    }
    
    delete(candidateId: string, row: number, col: number): Promise<any> {
        return this.apiService.deleteRquest('/comeths', candidateId, row, col)
    }
    
}