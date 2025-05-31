import axios from '../api/axios.js'
import type { Cometh } from '../models/api/cometh.js';
import type { GoalMap } from '../models/api/goal-map.js';
import type { Map } from '../models/api/map.js';
import type { Soloon } from '../models/api/soloon.js';

export async function getGoalMap(candidateId: string): Promise<GoalMap> {
    const response = await axios.get<GoalMap>(`/map/${candidateId}/goal`)
    return response.data
}

export async function getMap(candidateId: string): Promise<Map> {
    const response = await axios.get<Map>(`/map/${candidateId}`)
    return response.data
}

export async function addPolyanet(candidateId: string, row: number, col: number): Promise<any> {
    return addRequest(`/polyanets`, {
        candidateId: candidateId,
        row: row,
        column: col
    })
}

export async function addSoloon(candidateId: string, row: number, col: number, obj: Soloon): Promise<any> {
    return addRequest(`/soloons`, {
        candidateId: candidateId,
        row: row,
        column: col,
        color: obj.color
    })
}

export async function addCometh(candidateId: string, row: number, col: number, obj: Cometh): Promise<any> {
    return addRequest(`/comeths`, {
        candidateId: candidateId,
        row: row,
        column: col,
        direction: obj.direction
    })
}

export async function deletePolyanet(candidateId: string, row: number, col: number): Promise<void> {
    return deleteRquest('/polyanets', candidateId, row, col)
}

export async function deleteSoloon(candidateId: string, row: number, col: number): Promise<void> {
    return deleteRquest('/soloons', candidateId, row, col)
}

export async function deleteCometh(candidateId: string, row: number, col: number): Promise<void> {
    return deleteRquest('/comeths', candidateId, row, col)
}

async function addRequest(url: string,  data: any): Promise<any> {
    const response = await axios.post(url, data)
    return response.data
}

async function deleteRquest(url: string, candidateId: string, row: number, col: number): Promise<void> {
    return axios.delete(url, {
        data: {
            candidateId: candidateId,
            row: row,
            column: col
        }
    })
}
