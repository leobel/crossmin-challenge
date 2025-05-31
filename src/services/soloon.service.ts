import type { SoloonColor } from "../models/api/soloon.js"
import type { IApiService } from "./api.service.js"

export interface ISoloonService {
    add(candidateId: string, row: number, col: number, color: SoloonColor): Promise<any>
    delete(candidateId: string, row: number, col: number): Promise<any>
}

export class SoloonService implements ISoloonService {

    constructor(readonly apiService: IApiService) {}
    
    add(candidateId: string, row: number, col: number, color: SoloonColor): Promise<any> {
        return this.apiService.addRequest(`/soloons`, {
            candidateId: candidateId,
            row: row,
            column: col,
            color: color
        })
    }
    
    async delete(candidateId: string, row: number, col: number): Promise<any> {
        return this.apiService.deleteRquest('/soloons', candidateId, row, col)
    }
    
}