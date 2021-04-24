/**
 * creep 内存拓展
 */
interface CreepMemory<Role extends CreepRoleConstant = CreepRoleConstant> {
  /**
   * 是否禁止重新孵化
   */
  cantRespawn?: boolean;
  /**
   * 孵化该 creep 的房间
   */
  spawnRoom: string;
  /**
   * 移动缓存
   */
  moveInfo?: MoveInfo;
  /**
   * 是否打印上一步座标
   */
  logPrePos?: boolean;
  /**
   * 来自的 shard
   * 在死后会向这个 shard 发送孵化任务
   * creep 会通过这个字段检查一个 creep 是不是跨 shard creep
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
  /**
   * creep 的角色
   */
  role: CreepRoleConstant;
  /**
   * 该 creep 的特殊体型
   */
  bodyType?: string;
  /**
   * creep 是否已经准备好可以工作了
   */
  ready: boolean;
  /**
   * 是否设置了路径点
   */
  setWayPoint: boolean;
  /**
   * 是否抵达了路径点
   */
  inPlace: boolean;
  /**
   * 是否在工作
   */
  working: boolean;
  /**
   * creep 在工作时需要的自定义配置，在孵化时由 spawn 复制
   */
  data?: RoleDatas[Role];
  /**
   * 要采集的资源 Id
   */
  sourceId?: Id<AllEnergySource>;
  /**
   * 要存放到的目标建筑
   */
  targetId?: Id<Source | StructureWithStore | ConstructionSite>;
  /**
   * 要维修的建筑 id，维修单位特有
   */
  repairStructureId?: Id<AnyStructure>;
  /**
   * deposit 采集者特有，deposit 的类型
   */
  depositType?: DepositConstant;
  /**
   * 要填充的墙 id
   */
  fillWallId?: Id<StructureWall | StructureRampart>;
  /**
   * manager 特有 要填充能量的建筑 id
   */
  fillStructureId?: Id<StructureWithStore>;
  /**
   * 建筑工特有，当前缓存的建筑工地
   */
  constructionSiteId?: Id<ConstructionSite>;
  /**
   * 建筑工特有，当前缓存的建筑工地座标
   */
  constructionSitePos?: number[];
  /**
   * 建筑工特有，当前缓存的建筑工地类型
   */
  constructionSiteType?: StructureConstant;
  /**
   * 可以执行建筑的单位特有，当该值为 true 时将不会尝试建造
   */
  dontBuild?: boolean;
  /**
   * collector 允许自己再次尝试发布 power 强化 Soruce 任务的时间
   * 在 Game.time 小于该值时不会尝试发布强化任务
   */
  regenSource?: number;
  /**
   * 移动到某位置需要的时间
   * 例如：miner 会用它来保存移动到 mineral 的时间
   */
  travelTime?: number;
  /**
   * manager 特有，当前任务正在转移的资源类型
   */
  taskResource?: ResourceConstant;
  /**
   * manager 特有，当前正在执行的物流任务索引
   */
  transportTaskKey?: number;
  /**
   * 运营单位特有，当前正在执行的物流 / 工作任务索引
   */
  taskKey?: number;
  /**
   * 能量采集单位特有，当前的采集模式
   */
  harvestMode?: HarvestMode;
  /**
   * 攻击者的小队编号 暂时未使用
   */
  squad?: number;
  /**
   * 是否已经在待命位置, 此状态为 true 时，防御者的standBy方法将不会在调用 pos.isEqualTo()
   */
  isStanBy?: boolean;
  /**
   *  rangeSoldier 特有，是否启用 massAttack
   */
  massMode?: boolean;
}

/**
 * Creep 拓展
 */
interface Creep<Role extends CreepRoleConstant = CreepRoleConstant> {
  memory: CreepMemory<Role>;

  log(content: string, color?: Colors, notify?: boolean): void;

  work(): void;

  goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode;

  setWayPoint(target: string[] | string): ScreepsReturnCode;

  getEngryFrom(target: Structure | Source | Ruin | Resource<RESOURCE_ENERGY>): ScreepsReturnCode;
  backToGetEnergy(): boolean;

  transferTo(target: AnyCreep | Structure, RESOURCE: ResourceConstant, moveOpt?: MoveOpt): ScreepsReturnCode;

  upgradeRoom(roomName: string): ScreepsReturnCode;

  buildStructure(
    targetConstruction?: ConstructionSite
  ): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND;

  steadyWall(): OK | ERR_NOT_FOUND;
  fillDefenseStructure(expectHits?: number): boolean;

  getFlag(flagName: string): Flag | null;
  attackFlag(flagName: string): boolean;
  healTo(creep: Creep): void;
  standBy(): void;
  defense(): void;
  dismantleFlag(flagName: string, healerName?: string): boolean;

  rangedAttackTargetWithRange(target: AnyCreep, range?: number): OK | ERR_NOT_FOUND;
  rangedAttackLowestHitsHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND;
  rangedAttackHostileHealCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND;
  rangedAttackNearestHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND;
  rangedAttackLowestHitsHostileStructures(): OK | ERR_NOT_FOUND;
  rangedAttackNearHostileStructures(): OK | ERR_NOT_FOUND;

  getHostileCreepsWithCache(hard?: boolean): AnyCreep[];
  getHostileStructuresWithCache(hard?: boolean): Structure<StructureConstant>[];
  callDefender(targetRoomName: string, targetFlagName: string, spawnRoomName: string): void;
}
