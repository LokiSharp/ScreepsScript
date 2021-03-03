/**
 * 状态收集模块
 *
 * 该模块负责维护内存中的状态字段，并提供接口以收集状态
 * 该模块的数据被保存在 Memory.stats 中
 * 在使用前需要调用 initGlobalStats 方法
 */

/**
 * 更新指定房间的统计数据
 *
 * @param roomName 房间名
 * @param getNewStats 统计数据的获取回调，该方法提供房间现存的状态作为参数，且返回的值将被合并到房间的统计数据中
 */
export function setRoomStats(roomName: string, getNewStats: (stats: RoomStats) => Partial<RoomStats>): void {
  if (!Memory.stats.rooms[roomName]) {
    Memory.stats.rooms[roomName] = {
      nukerEnergy: 0,
      nukerG: 0,
      nukerCooldown: 0,
      controllerRatio: 0,
      controllerLevel: 0,
      transporterWorkingTime: 0,
      transporterLifeTime: 0,
      totalEnergy: 0,
      energyCalcTime: 0,
      energyGetRate: NaN,
      commRes: {},
      resources: {}
    };
  }

  _.assign(Memory.stats.rooms[roomName], getNewStats(Memory.stats.rooms[roomName]));
}

/**
 * 清理指定房间的统计数据
 *
 * @param roomName 要清理统计的房间名
 */
export function clearRoomStats(roomName: string): void {
  delete Memory.stats.rooms[roomName];
}

/**
 * 获取指定房间的统计数据
 *
 * @param roomName 要获取统计的房间名
 */
export function getRoomStats(roomName: string): RoomStats {
  return Memory.stats.rooms[roomName];
}

/**
 * 初始化全局存储
 * 每次 global 重置后
 */
export function initGlobalStats(): void {
  if (!Memory.stats) Memory.stats = { rooms: {} };
}

/**
 * 全局统计信息扫描器
 * 负责搜集关于 cpu、memory、GCL、GPL 的相关信息
 */
export function stateScanner(): void {
  if (Game.time % 5) return;
  // 统计 GCL / GPL 的升级百分比和等级
  Memory.stats.gcl = (Game.gcl.progress / Game.gcl.progressTotal) * 100;
  Memory.stats.gclLevel = Game.gcl.level;
  Memory.stats.gpl = (Game.gpl.progress / Game.gpl.progressTotal) * 100;
  Memory.stats.gplLevel = Game.gpl.level;
  // bucket 当前剩余量
  Memory.stats.bucket = Game.cpu.bucket;
  // 统计剩余钱数
  Memory.stats.credit = Game.market.credits;
  // CPU 的当前使用量
  Memory.stats.cpu = Game.cpu.getUsed();
}

export function cpuUsageScanner(key: string): void {
  if (!Memory.stats) Memory.stats = { rooms: {} };
  if (!Memory.stats.cpuCost) {
    Memory.stats.cpuCost = {};
  }
  if (Memory.stats.gameTime !== Game.time) {
    Memory.stats.cpuCost = {};
    Memory.stats.gameTime = Game.time;
  }

  const startCpu = Object.values(Memory.stats.cpuCost);
  Memory.stats.cpuCost[key] = Game.cpu.getUsed() - _.sum(startCpu);
}

/**
 * 状态收集的框架插件
 */
export const stateScannerAppPlugin: AppLifecycleCallbacks = {
  reset: initGlobalStats,
  tickEnd: stateScanner
};
