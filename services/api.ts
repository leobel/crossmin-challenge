import axios from '../api/axios'
import type { GoalMap } from '../models/api/goal-map';
import type { Map } from '../models/api/map';

export async function getGoalMap(candidateId: string): Promise<GoalMap> {
    const response = await axios.get<GoalMap>(`/map/${candidateId}/goal`)
    return response.data
}

export async function getMap(candidateId: string): Promise<Map> {
    const response = await axios.get<Map>(`/map/${candidateId}`)
    return response.data
}

export async function addPolyanet(candidateId: string, row: number, col: number): Promise<void> {
    return axios.post(`/polyanets`, {
        candidateId: candidateId,
        row: row,
        column: col
    })
}

export async function deletePolyanet(candidateId: string, row: number, col: number): Promise<void> {
    return axios.delete(`/polyanets`, {
        data: {
            candidateId: candidateId,
            row: row,
            column: col
        }
    })
}
