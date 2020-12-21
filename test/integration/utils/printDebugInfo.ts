export function printDebugInfo(memory: Memory, gameTime: number): void {
  console.log("[tick]", gameTime);
  console.log(`[RCL%] ${memory.stats.rooms.W0N0.controllerRatio} [RCL] ${memory.stats.rooms.W0N0.controllerLevel}`);
  console.log("[structureNums]", memory.stats.rooms.W0N0.structureNums);
  console.log("[constructionSiteNums]", memory.stats.rooms.W0N0.constructionSiteNums);
  console.log("[creeps]", Object.keys(memory.creepConfigs).toString());
  console.log("[cpuCost]", memory.stats.cpuCost);
  console.log(`[CPU] ${memory.stats.cpu} [bucket] ${memory.stats.bucket}`);
  console.log(`[memoryCost] ${JSON.stringify(memory).length}`);
}
