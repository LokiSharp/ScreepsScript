// eslint-disable-next-line @typescript-eslint/ban-types
export function getCpuUsage(key: string): void {
  if (!Memory.stats) Memory.stats = { rooms: {} };
  if (!Memory.stats.cpuCost) {
    Memory.stats.cpuCost = {};
  }
  if (Memory.stats.gameTime !== Game.time) {
    Memory.stats.cpuCost = {};
    Memory.stats.gameTime = Game.time;
  }

  const startCpu = Object.values(Memory.stats.cpuCost);
  const cpuCost = Game.cpu.getUsed() - _.sum(startCpu);

  Memory.stats.cpuCost[key] = cpuCost;
}
