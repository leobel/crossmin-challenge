import dotenv from 'dotenv'
import { buildCrossPolyanets } from './build-cross-polyanets'
import { getGoalMap } from './services/api'

dotenv.config()

const candidateId = process.env.CANDIDATE_ID!

async function init() {
    try {
        const goalMap = await getGoalMap(candidateId)
        const ok = await buildCrossPolyanets(candidateId, goalMap)
        if (ok) {
            console.log("Yeah!, cross polyanets built")
        } else {
            console.log(`couldn't build cross polyanet for candidate: ${candidateId}`)
        }
    } catch (err) {
        console.log('Error:', err)
        console.log(`couldn't build cross polyanet for candidate: ${candidateId}`)
    }
}

await init()

