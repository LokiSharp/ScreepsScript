export function printDebugInfo(memory: Memory, gameTime: number): void {
  const roomMemory = memory.stats.rooms.W0N0;
  console.log("[tick]", gameTime);
  console.log(`[RCL%] ${roomMemory.controllerRatio} [RCL] ${roomMemory.controllerLevel}`);
  console.log("[structureNums]", roomMemory.structureNums);
  console.log("[constructionSiteNums]", roomMemory.constructionSiteNums);
  console.log("[creeps]", Object.keys(memory.creepConfigs).toString());
  console.log("[cpuCost]", memory.stats.cpuCost);
  console.log(`[CPU] ${memory.stats.cpu} [bucket] ${memory.stats.bucket}`);
  console.log(`[memoryCost] ${JSON.stringify(memory).length}`);
  if (roomMemory.debugMessage) console.log(`[debugMessage] ${roomMemory.debugMessage}`);
}
