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
export const ALL_SHARD_NAME: ShardName[] = ["shard0", "shard1", "shard2", "shard3", "shardSeason"];

/**
 * powerProcess 的设置
 */
export const powerSettings = {
  // 当前房间 storage 内存量低于limit时自动停止 process
  processEnergyLimit: 500000
};

/**
 * deposit 最大的采集冷却时长
 * 超过该时长则不会再进行挖掘
 */
export const DEPOSIT_MAX_COOLDOWN = 100;

/**
 * observer 房间扫描间隔
 */
export const observerInterval = 10;

// 每个 observer 同时允许采集的 pb 和 depo 的最大数量
export const OBSERVER_POWERBANK_MAX = 1;
export const OBSERVER_DEPOSIT_MAX = 2;

/**
 * powerbank 的采集阶段
 * @property {} ATTACK 正在拆除
 * @property {} PREPARE 快拆完了，carrier 准备过来
 * @property {} TRANSFE 拆除完成，正在搬运
 */
export const PB_HARVESTE_STATE = {
  ATTACK: "attack",
  PREPARE: "prepare",
  TRANSFER: "transfer"
};

/**
 * miner 的矿物采集上限
 * 当 terminal 中的资源多余这个值时，miner 将不再继续采矿
 */
export const minerHervesteLimit = 200000;

// pc 空闲时会搓 ops，下面是搓的上限
export const maxOps = 50000;
