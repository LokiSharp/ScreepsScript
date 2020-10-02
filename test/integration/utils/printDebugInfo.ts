export function printDebugInfo(memory: Memory, gameTime: number): void {
  console.log("[tick]", gameTime);
  console.log(`[memory] [CPU] ${memory.stats.cpu} [bucket] ${memory.stats.bucket}, \n`);
  console.log(
    `[memory] [RCL%] ${memory.stats.rooms.W0N0.controllerRatio} [RCL] ${memory.stats.rooms.W0N0.controllerLevel}, \n`
  );
  console.log("[structureNums]", memory.stats.rooms.W0N0.structureNums, "\n");
}
