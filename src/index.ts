import 'dotenv/config.js'

import Megaverse from './megaverse.js'
import type { ObjectMap } from './models/api/map.js'
import type { AstralLiteral } from './models/api/astral.js'
import { createAstralObjectMap, mapService } from './utils/index.js'


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
}

async function buildLogo(candidateId: string) {
    try {
        const megaverse = new Megaverse(candidateId)
        const goalMap = await mapService.getGoalMap(candidateId)
        const candidateMap = await mapService.getCandidateMap(candidateId)
        const goal: ObjectMap = createAstralObjectMap(goalMap, candidateId)
        const candidate: ObjectMap = createAstralObjectMap(candidateMap, candidateId)
        const mintLogo = await megaverse.build(goal, candidate)
        console.log("Yeah!, crossmint logo built")
        printMap(mintLogo)
    } catch (err) {
        console.log(err)
        console.log(`couldn't build crossmint logo for candidate: ${candidateId}`)
    }
}

function printMap(map: ObjectMap) {
    for (let i = 0; i < map.length; i++) {
        console.log(map[i].map(cell => `${toEmoji(cell.toLiteral())}`).join(' '))
    }
}

function toEmoji(cell: AstralLiteral) {
    switch (cell) {
        case "SPACE": return "🌌";
        case "POLYANET": return "🪐";
        case "RED_SOLOON": return "🔴";
        case "BLUE_SOLOON": return "🔵";
        case "PURPLE_SOLOON": return "🟣";
        case "WHITE_SOLOON": return "⚪️";
        case "UP_COMETH": return "⬆️ ";
        case "DOWN_COMETH": return "⬇️ ";
        case "LEFT_COMETH": return "⬅️ ";
        case "RIGHT_COMETH": return "➡️ ";
        default: return "❓";
    }
}