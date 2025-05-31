import type { AxiosInstance } from "axios"
import { requestWithRetry } from "../utils/index.js"
import { ChallengeError } from "../models/challenge-error.js"

export interface IApiService {
    getRequest<T>(url: string): Promise<T>
    addRequest(url: string,  data: any): Promise<any>
    deleteRquest(url: string, candidateId: string, row: number, col: number): Promise<any>
}

export class ApiService implements IApiService {

    constructor(
        readonly retries: number,
        readonly backoff: number,
        readonly axios: AxiosInstance) {
    }

    async getRequest<T>(url: string): Promise<T> {
        const response = await requestWithRetry(() => this.axios.get<T>(url), this.retries, this.backoff)
        if (response.status === "rejected") {
            throw new ChallengeError(`Something went wrong requesting: ${url} `, {reason: response.reason})
        }
        return response.value.data
    }
    
    async addRequest(url: string,  data: any): Promise<any> {
        const response = await requestWithRetry(() => this.axios.post(url, data), this.retries, this.backoff)
        if (response.status === "rejected") {
            throw new ChallengeError(`Something went wrong requesting: ${url} `, {data, reason: response.reason})
        }
        return response.value.data
    }
    
    async deleteRquest(url: string, candidateId: string, row: number, col: number): Promise<any> {
        const response = await requestWithRetry(() =>  this.axios.delete(url, {
            data: {
                candidateId: candidateId,
                row: row,
                column: col
            }
        }), this.retries, this.backoff)
        if (response.status === "rejected") {
            throw new ChallengeError(`Something went wrong requesting: ${url} `, {reason: response.reason})
        }
        return response.value.data
    }
}