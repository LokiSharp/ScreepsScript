import * as fs from "fs-extra";
import * as path from "path";

const SERVER_PATH = path.resolve(process.cwd(), "server");
const LOG_PATH = path.resolve(SERVER_PATH, "log.json");
const debugInfos: Record<number, unknown> = {};

export function printDebugInfo(memory: Memory, gameTime: number): void {
  const debugInfo = getDebugInfo(memory, gameTime);
  console.log(debugInfo);
  debugInfos[debugInfo.tick as number] = debugInfo;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  fs.writeFileSync(LOG_PATH, JSON.stringify(debugInfos));
}

function getDebugInfo(memory: Memory, gameTime: number): Record<string, unknown> {
  const roomMemory = memory.stats.rooms.W0N0;
  return {
    tick: gameTime,
    controllerRatio: roomMemory.controllerRatio,
    controllerLevel: roomMemory.controllerLevel,
    structureNums: roomMemory.structureNums,
    constructionSiteNums: roomMemory.constructionSiteNums,
    creeps: Object.keys(memory.creeps),
    creepConfigs: Object.keys(memory.creepConfigs),
    cpuCost: memory.stats.cpuCost,
    cpu: memory.stats.cpu,
    cpuBucket: memory.stats.bucket,
    memoryCost: JSON.stringify(memory).length,
    debugMessage: roomMemory.debugMessage ? roomMemory.debugMessage : ""
  };
}
