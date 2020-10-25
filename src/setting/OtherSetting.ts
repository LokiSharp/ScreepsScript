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

/**
 * 所有的 shard 名称，用于跨 shard 通讯，
 * 当增加了新 shard 时需要在该数组中添加其名称后才会启用和新 shard 的通讯
 */
export const ALL_SHARD_NAME: ShardName[] = ["shard0", "shard1", "shard2", "shard3"];
