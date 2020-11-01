/**
 * 默认的旗帜名称
 */
export const DEFAULT_FLAG_NAME = {
  // 进攻
  ATTACK: "attack",
  // 占领
  CLAIM: "claim",
  // 待命
  STANDBY: "standBy",
  // 掠夺
  REIVER: "reiver"
};

// 在执行了第一次移除操作之后，玩家需要在多少 tick 内重新执行移除操作才能真正发起移除请求
export const ROOM_REMOVE_INTERVAL = 30;

/**
 * 所有的 shard 名称，用于跨 shard 通讯，
 * 当增加了新 shard 时需要在该数组中添加其名称后才会启用和新 shard 的通讯
 */
export const ALL_SHARD_NAME: ShardName[] = ["shard0", "shard1", "shard2", "shard3"];

/**
 * powerProcess 的设置
 */
export const powerSettings = {
  // 当前房间 storage 内存量低于limit时自动停止 process
  processEnergyLimit: 500000
};
