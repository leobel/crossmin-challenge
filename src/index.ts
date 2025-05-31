import 'dotenv/config.js'

import { MapService } from './services/map.service.js'
import { ApiService } from './services/api.service.js'
import axios from './api/axios.js'
import { PolyanetService } from './services/polyanet.service.js'
import { SoloonService } from './services/soloon.service.js'
import { ComethService } from './services/cometh.service.js'
import Megaverse from './megaverse.js'
import type { ObjectMap } from './models/api/map.js'
import type { AstralLiteral } from './models/api/astral.js'


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
        const apiService = new ApiService(5, 1000, axios)
        const polyanetService = new PolyanetService(apiService)
        const soloonService = new SoloonService(apiService)
        const comethService = new ComethService(apiService)
        const mapService = new MapService(apiService)
        const megaverse = new Megaverse(candidateId, polyanetService, soloonService, comethService)
        const goalMap = await mapService.getGoalMap(candidateId)
        const candidateMap = await mapService.getCandidateMap(candidateId)

        const mintLogo = await megaverse.build(goalMap, candidateMap)
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