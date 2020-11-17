/**
 * Game 对象拓展
 */
interface Game {
  // 本 tick 是否已经执行了 creep 数量控制器了
  // 每 tick 只会调用一次
  hasRunCreepNumberController: boolean;
  // 本 tick 是否需要执行保存 InterShardMemory
  needSaveInterShardData: boolean;
}
