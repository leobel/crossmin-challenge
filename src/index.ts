import dotenv from 'dotenv'
import { buildCrossPolyanets } from './build-cross-polyanets.js'
import { getGoalMap } from './services/api.js'
import { buildMintLogo } from './build-crossmint-logo.js'

dotenv.config()

const candidateId = process.env.CANDIDATE_ID!
const commands = process.env.VALID_COMMADS!.split(',')

const args = process.argv.slice(2)

function getArg(flag: string): string | undefined {
    const index = args.indexOf(flag)
    if (index !== -1 && args[index + 1]) {
        return args[index + 1]
    }
    return undefined
}

const cmd = getArg('-c')

if (!cmd || !commands.includes(cmd)) {
    console.error(`Invalid comand: "${cmd}".`)
    console.error(`Usage: npx tsx index.ts -c {cmd} where cmd is: [${commands}].`)
    console.error(`E.g: index.ts -c "logo".`)
    process.exit(1)
}

switch (cmd) {
    case "logo":
        await buildLogo(candidateId)
        break;
    case "cross":
        await buildCross(candidateId)
        break;
}


async function buildCross(candidateId: string) {
    try {
        const goalMap = await getGoalMap(candidateId)
        await buildCrossPolyanets(candidateId, goalMap)
        console.log("Yeah!, cross polyanets built")
    } catch (err) {
        console.log(err)
        console.log(`couldn't build cross polyanet for candidate: ${candidateId}`)
    }
}

async function buildLogo(candidateId: string) {
    try {
        const goalMap = await getGoalMap(candidateId)
        await buildMintLogo(candidateId, goalMap)
        console.log("Yeah!, crossmint logo built")
    } catch (err) {
        console.log(err)
        console.log(`couldn't build crossmint logo for candidate: ${candidateId}`)
    }
}
