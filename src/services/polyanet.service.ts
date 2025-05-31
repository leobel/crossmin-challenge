import type { IApiService } from "./api.service.js"

export interface IPolyanetService {
    add(candidateId: string, row: number, col: number): Promise<any>
    delete(candidateId: string, row: number, col: number): Promise<any>
}

export class PolyanetService implements IPolyanetService {

    constructor(readonly apiService: IApiService) {}

    add(candidateId: string, row: number, col: number): Promise<any> {
        return this.apiService.addRequest(`/polyanets`, {
            candidateId: candidateId,
            row: row,
            column: col
        })
    }

    delete(candidateId: string, row: number, col: number): Promise<any> {
        return this.apiService.deleteRquest('/polyanets', candidateId, row, col)
    }
   
}