/**
 * creep 内存拓展
 */
interface CreepMemory {
  /**
   * 移动缓存
   */
  moveInfo?: MoveInfo;

  // 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞墙
  prePos?: string;

  /**
   * 来自的 shard
   * 在死后会向这个 shard 发送孵化任务
   * creepController 会通过这个字段检查一个 creep 是不是跨 shard creep
   */
  fromShard?: ShardName;

  /**
   * 自己是否会向他人发起对穿
   */
  disableCross?: boolean;

  /**
   * 该 Creep 是否在进行工作（站着不动）
   */
  stand?: boolean;

  // creep 的角色
  role: CreepRoleConstant;
  // creep 是否已经准备好可以工作了
  ready: boolean;
  // 是否在工作
  working: boolean;
  // creep 在工作时需要的自定义配置，在孵化时由 spawn 复制
  data?: CreepData;
  // 要采集的资源 Id
  sourceId?: Id<AllEnergySource>;
  // 要存放到的目标建筑
  targetId?: Id<Source | StructureWithStore | ConstructionSite>;
  // deposit 采集者特有，deposit 的类型
  depositType?: DepositConstant;
  // 要填充的墙 id
  fillWallId?: Id<StructureWall | StructureRampart>;
  // manager 特有 要填充能量的建筑 id
  fillStructureId?: Id<StructureWithStore>;
  // 建筑工特有，当前缓存的建筑工地（目前只有外矿采集者在用）
  constructionSiteId?: Id<ConstructionSite>;
  // 可以执行建筑的单位特有，当该值为 true 时将不会尝试建造
  dontBuild?: boolean;
  // 远程寻路缓存
  farMove?: {
    // 序列化之后的路径信息
    path?: string;
    // 移动索引，标志 creep 现在走到的第几个位置
    index?: number;
    // 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞墙
    prePos?: string;
    // 缓存路径的目标，该目标发生变化时刷新路径, 形如"14/4E14S1"
    targetPos?: string;
  };
  // 移动到某位置需要的时间
  // 例如：miner 会用它来保存移动到 mineral 的时间
  travelTime?: number;
  // manager 特有，当前任务正在转移的资源类型
  taskResource?: ResourceConstant;
}
