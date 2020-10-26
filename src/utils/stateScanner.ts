/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
export default function stateScanner(): void {
  if (Game.time % 20) return;

  if (!Memory.stats) Memory.stats = { rooms: {} };

  // 统计 GCL / GPL 的升级百分比和等级
  Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
  Memory.stats.gclLevel = Game.gcl.level;
  Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
  Memory.stats.gplLevel = Game.gpl.level;
  // CPU 的当前使用量
  Memory.stats.cpu = Game.cpu.getUsed();
  // bucket 当前剩余量
  Memory.stats.bucket = Game.cpu.bucket;
  // 统计剩余钱数
  Memory.stats.credit = Game.market.credits;
}
