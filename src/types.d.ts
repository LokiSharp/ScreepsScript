declare namespace NodeJS {
  // 全局对象
  interface Global {
    InterShardMemory: InterShardMemory;
    // 是否已经挂载拓展
    hasExtension: boolean;
  }
}

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

// 当 creep 不需要生成时 mySpawnCreep 返回的值
type CREEP_DONT_NEED_SPAWN = -101;
// spawn.mySpawnCreep 方法的返回值集合
type MySpawnReturnCode = ScreepsReturnCode | CREEP_DONT_NEED_SPAWN;

// 本项目中出现的颜色常量
type Colors = "green" | "blue" | "yellow" | "red";

interface Memory {
  // 是否显示 cpu 消耗
  showCost?: boolean;
  // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
  creepConfigs: {
    [creepName: string]: {
      // creep 的角色名
      role: CreepRoleConstant;
      // creep 的具体配置项，每个角色的配置都不相同
      data: CreepData;
      // 执行 creep 孵化的房间名
      spawnRoom: string;
    };
  };

  /**
   * 从其他 shard 跳跃过来的 creep 内存会被存放在这里
   * 等 creep 抵达后在由其亲自放在 creepConfigs 里
   *
   * 不能直接放在 creepConfigs
   * 因为有可能出现内存到了但是 creep 还没到的情况，这时候 creepController 就会以为这个 creep 死掉了从而直接把内存回收掉
   */
  crossShardCreeps: {
    [creepName: string]: CreepMemory;
  };

  // 要绕过的房间名列表，由全局模块 bypass 负责。
  bypassRooms: string[];
  // 掠夺资源列表，如果存在的话 reiver 将只会掠夺该名单中存在的资源
  reiveList: ResourceConstant[];

  // 资源来源表
  resourceSourceMap: {
    // 资源类型为键，房间名列表为值
    [resourceType: string]: string[];
  };

  // 白名单，通过全局的 whitelist 对象控制
  // 键是玩家名，值是该玩家进入自己房间的 tick 时长
  whiteList: {
    [userName: string]: number;
  };

  stats: {
    // GCl/GPL 升级百分比
    gcl?: number;
    gclLevel?: number;
    gpl?: number;
    gplLevel?: number;
    // CPU 当前数值及百分比
    cpu?: number;
    // bucket 当前数值
    bucket?: number;
    // 当前还有多少钱
    credit?: number;

    // 已经完成的房间物流任务比例
    roomTaskNumber?: { [roomTransferTaskType: string]: number };

    /**
     * 房间内的数据统计
     */
    rooms: {
      [roomName: string]: {
        // storage 中的能量剩余量
        energy?: number;
        // 终端中的 power 数量
        power?: number;
        // nuker 的资源存储量
        nukerEnergy?: number;
        nukerG?: number;
        nukerCooldown?: number;
        // 控制器升级进度，只包含没有到 8 级的
        controllerRatio?: number;
        controllerLevel?: number;
        structureNums?: { [structureName: string]: number };
        constructionSiteNums?: { [structureName: string]: number };
      };
    };
  };

  // 在模拟器中调试布局时才会使用到该字段，在正式服务器中不会用到该字段
  layoutInfo?: BaseLayout;
  // 用于标记布局获取到了那一等级
  layoutLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}

/**
 * 基地布局信息
 */
type BaseLayout = {
  // 该类型建筑应该被放置在什么地方
  [structureType in StructureConstant]?: [number, number][] | null;
}[];

/**
 * bodySet
 * 简写版本的 bodyPart[]
 * 形式如下
 * @example { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 }
 */
interface BodySet {
  [MOVE]?: number;
  [CARRY]?: number;
  [ATTACK]?: number;
  [RANGED_ATTACK]?: number;
  [WORK]?: number;
  [CLAIM]?: number;
  [TOUGH]?: number;
  [HEAL]?: number;
}

type BodySets = [BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet];

type BodyConfig = {
  [energyLevel in EnergyLevel]: BodyPartConstant[];
};

type EnergyLevel = "300" | "550" | "800" | "1300" | "1800" | "2300" | "5600" | "10000";

/**
 * 身体配置项类别
 * 包含了所有角色类型的身体配置
 */
type BodyConfigs = {
  [type in BodyAutoConfigConstant]: BodyConfig;
};

/**
 * creep 的配置项
 * @property isNeed 决定 creep 在死后是否需要再次孵化
 * @property prepare creep 在进入 source/target 状态机之前要执行的额外阶段
 * @property source creep非工作(收集能量时)执行的方法
 * @property target creep工作时执行的方法
 */
interface ICreepConfig {
  isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
  prepare?: (creep: Creep) => boolean;
  source?: (creep: Creep) => boolean;
  target?: (creep: Creep) => boolean;
  bodys: (room: Room, spawn: StructureSpawn) => BodyPartConstant[];
}

type BodyAutoConfigConstant =
  | "harvester"
  | "worker"
  | "transporter"
  | "processor"
  | "upgrader"
  | "reserver"
  | "remoteHarvester"
  | "attacker"
  | "healer"
  | "remoteHelper"
  | "dismantler";

/**
 * 所有 creep 角色的 data
 */
type CreepData =
  | EmptyData
  | HarvesterData
  | WorkerData
  | RemoteDeclarerData
  | RemoteHarvesterData
  | ProcessorData
  | ReiverData
  | WarUnitData
  | HealUnitData;

/**
 * 有些角色不需要 data
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyData {}

/**
 * 采集单位的 data
 * 执行从 sourceId 处采集东西，并转移至 targetId 处（不一定使用，每个角色都有自己固定的目标例如 storage 或者 terminal）
 */
interface HarvesterData {
  // 要采集的 source id
  sourceId: string;
  // 把采集到的资源存到哪里存在哪里
  targetId: string;
}

/**
 * 工作单位的 data
 * 由于由确定的工作目标所以不需要 targetId
 */
interface WorkerData {
  // 要使用的资源存放建筑 id
  sourceId: string;
}

/**
 * 中央运输者的 data
 * x y 为其在房间中的固定位置
 */
interface ProcessorData {
  x: number;
  y: number;
}

/**
 * 远程声明单位的 data
 * 这些单位都会和目标房间的 controller 打交道
 */
interface RemoteDeclarerData {
  // 要声明控制的房间名
  targetRoomName: string;
  // 自己出生的房间，claim 需要这个字段来向老家发布支援 creep
  spawnRoom?: string;
  // 给控制器的签名
  signText?: string;
  wayPoint?: string;
}

/**
 * 远程采集单位的 data
 * 包括外矿采集和公路房资源采集单位
 */
interface RemoteHarvesterData {
  // 要采集的资源旗帜名称
  sourceFlagName: string;
  // 资源要存放到哪个建筑里，外矿采集者必须指定该参数
  targetId?: string;
  // 出生房名称，资源会被运输到该房间中
  spawnRoom?: string;
}

/**
 * 掠夺者单位的 ddata
 */
interface ReiverData {
  // 目标建筑上的旗帜名称
  flagName: string;
  // 要搬运到的建筑 id
  targetId: string;
}

/**
 * 战斗单位的 data
 */
interface WarUnitData {
  // 要攻击的旗帜名
  targetFlagName: string;
  // 其治疗者名称，战斗单位会尽量保持该单位和自己相邻
  healerName?: string;
  // 待命位置旗帜名
  // standByFlagName: string
  // 是否持续孵化
  keepSpawn: boolean;
}

/**
 * 治疗单位的 data
 */
interface HealUnitData {
  // 要治疗的旗帜名
  creepName: string;
  // 待命位置旗帜名
  standByFlagName?: string;
  // 是否持续孵化
  keepSpawn?: boolean;
}

/**
 * Creep 拓展
 * 来自于 mount.creep.ts
 */
interface Creep {
  _id: string;

  log(content: string, color?: Colors, notify?: boolean): void;
  work(): void;
  goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode;
  setWayPoint(target: string[] | string): ScreepsReturnCode;
  getEngryFrom(target: Structure | Source): ScreepsReturnCode;
  transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode;
  upgrade(): ScreepsReturnCode;
  buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND;
  steadyWall(): OK | ERR_NOT_FOUND;
  fillDefenseStructure(expectHits?: number): boolean;

  getFlag(flagName: string): Flag | null;
  attackFlag(flagName: string): boolean;
  healTo(creep: Creep): void;
  dismantleFlag(flagName: string, healerName?: string): boolean;
}

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
  sourceId?: string;
  // 要存放到的目标建筑
  targetId?: string;
  fillWallId?: string;
  // manager 特有 要填充能量的建筑 id
  fillStructureId?: string;
  // 建筑工特有，当前缓存的建筑工地（目前只有外矿采集者在用）
  constructionSiteId?: string;
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
  // manager 特有，当前任务正在转移的资源类型
  taskResource?: ResourceConstant;
}

/**
 * PowerCreep 内存拓展
 */
interface PowerCreepMemory {
  /**
   * 移动缓存
   */
  moveInfo?: MoveInfo;

  // 等同于 Creep.memory.fromShard
  fromShard?: ShardName;

  // pc 暂时没有角色
  role: undefined;
  // 为 true 时执行 target，否则执行 source
  working: boolean;
  // 接下来要检查哪个 power
  powerIndex: number;
  // 当前要处理的工作
  // 字段值均为 PWR_* 常量
  // 在该字段不存在时将默认执行 PWR_GENERATE_OPS（如果 power 资源足够并且 ops 不足时）
  task: PowerConstant;
  // 工作的房间名，在第一次出生时由玩家指定，后面会根据该值自动出生到指定房间
  workRoom: string;

  /**
   * 同 creep.memory.stand
   */
  stand: boolean;

  /**
   * 同 creep.memory.disableCross
   */
  disableCross?: boolean;

  // 要添加 REGEN_SOURCE 的 souce 在 room.sources 中的索引值
  sourceIndex?: number;
}

// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant | RemoteRoleConstant | WarRoleConstant;

// 房间基础运营
type BaseRoleConstant = "harvester" | "filler" | "upgrader" | "builder" | "repairer" | "collector";

type AdvancedRoleConstant = "manager" | "processor";

// 远程单位
type RemoteRoleConstant =
  | "reserver"
  | "remoteHarvester"
  | "reiver"
  | "claimer"
  | "remoteUpgrader"
  | "remoteBuilder"
  | "moveTester";

// 战斗单位
type WarRoleConstant =
  | "soldier"
  | "defender"
  | "healer"
  | "dismantler"
  | "boostSoldier"
  | "boostHealer"
  | "boostDismantler";

/**
 * creep 工作逻辑集合
 * 包含了每个角色应该做的工作
 */
type CreepWork = {
  [role in CreepRoleConstant]: (data: CreepData) => ICreepConfig;
};

/**
 * 房间拓展
 * 来自于 mount.structure.ts
 */
interface Room {
  log(content: string, instanceName: string, color?: Colors | undefined, notify?: boolean): void;

  // creep 发布 api
  releaseCreep(role: BaseRoleConstant | AdvancedRoleConstant, releaseNumber?: number): ScreepsReturnCode;
  spawnReiver(sourceFlagName: string, targetStructureId: string): string;
  addRemoteHelper(remoteRoomName: string, wayPointFlagName?: string): void;
  addRemoteReserver(remoteRoomName: string, single?: boolean): void;
  addRemoteCreepGroup(remoteRoomName: string): void;
  spwanSoldier(targetFlagName: string, num?: number): string;

  /**
   * 下述方法在 @see /src/mount.room.ts 中定义
   */
  // 孵化队列 api
  addSpawnTask(taskName: string): number | ERR_NAME_EXISTS;
  hasSpawnTask(taskName: string): boolean;
  clearSpawnTask(): void;
  hangSpawnTask(): void;

  // 房间物流 api
  addRoomTransferTask(task: RoomTransferTasks, priority?: number): number;
  hasRoomTransferTask(taskType: string): boolean;
  getRoomTransferTask(): RoomTransferTasks | null;
  handleLabInTask(resourceType: ResourceConstant, amount: number): boolean;
  deleteCurrentRoomTransferTask(): void;

  // 中央物流 api
  addCenterTask(task: ITransferTask, priority?: number): number;
  hasCenterTask(submit: CenterStructures | number): boolean;
  hangCenterTask(): number;
  handleCenterTask(transferAmount: number): void;
  getCenterTask(): ITransferTask | null;
  deleteCurrentCenterTask(): void;

  // pos 处理 api
  serializePos(pos: RoomPosition): string;
  unserializePos(posStr: string): RoomPosition | undefined;

  // 资源共享 api
  giver(roomName: string, resourceType: ResourceConstant, amount?: number): string;
  shareRequest(resourceType: ResourceConstant, amount: number): boolean;
  shareAddSource(resourceType: ResourceConstant): boolean;
  shareRemoveSource(resourceType: ResourceConstant): void;
  shareAdd(targetRoom: string, resourceType: ResourceConstant, amount: number): boolean;

  // boost api
  boost(
    boostType: string,
    boostConfig: IBoostConfig
  ): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_ARGS | ERR_NOT_ENOUGH_RESOURCES;
  boostCreep(creep: Creep): OK | ERR_NOT_FOUND | ERR_BUSY | ERR_NOT_IN_RANGE;

  // 战争相关
  startWar(boostType: BoostType): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET;
  stopWar(): OK | ERR_NOT_FOUND;

  // 房间基础服务
  factory?: StructureFactory;
  powerSpawn: StructurePowerSpawn;
  nuker: StructureNuker;
  observer: StructureObserver;
  centerLink: StructureLink;
  extractor: StructureExtractor;
  mineral: Mineral;
  sources: Source[];
  sourceContainers: StructureContainer[];

  // 房间基础服务缓存
  factoryCache: StructureFactory;
  mineralCache: Mineral;
  powerSpawnCache: StructurePowerSpawn;
  nukerCache: StructureNuker;
  sourcesCache: Source[];
  centerLinkCache: StructureLink;
  observerCache: StructureObserver;
  extractorCache: StructureExtractor;
  sourceContainersCache: StructureContainer[];

  // 已拥有的房间特有，tower 负责维护
  enemys: (Creep | PowerCreep)[];
  // 需要维修的建筑，tower 负责维护，为 1 说明建筑均良好
  damagedStructure: AnyStructure | 1;
  // 该 tick 是否已经有 tower 刷过墙了
  hasFillWall: boolean;
  // 外矿房间特有，外矿单位维护
  // 一旦该字段为 true 就告诉出生点暂时禁止自己重生直到 1500 tick 之后
  hasEnemy: boolean;
  hasRunLab: boolean;

  // 焦点墙，维修单位总是倾向于优先修复该墙体
  importantWall: StructureWall | StructureRampart;

  // 获取房间中的有效能量来源
  getAvailableSource(): StructureTerminal | StructureStorage | StructureContainer | Source;

  // 自动规划相关
  findBaseCenterPos(): RoomPosition[];
  confirmBaseCenter(targetPos?: RoomPosition[]): RoomPosition | ERR_NOT_FOUND;
  setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS;
  planLayout(): string;
  clearStructure(): OK | ERR_NOT_FOUND;
  addRemote(remoteRoomName: string, targetId: string): OK | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  removeRemote(remoteRoomName: string, removeFlag?: boolean): OK | ERR_NOT_FOUND;
  claimRoom(targetRoomName: string, signText?: string): OK;
  registerContainer(container: StructureContainer): OK;
}

/**
 * 房间内存
 */
interface RoomMemory {
  // 该房间的生产队列，元素为 creepConfig 的键名
  spawnList?: string[];
  // 需要放置的工地（CS）队列
  delayCSList: string[];

  // 房间内的资源和建筑 id
  mineralId: Id<Mineral>;
  factoryId: Id<StructureFactory>;
  extractorId: Id<StructureExtractor>;
  nukerId: Id<StructureNuker>;
  sourceIds: Id<Source>[];
  sourceContainersIds: Id<StructureContainer>[];
  ruinIds: Id<Ruin>[];
  constructionSiteIds: Id<ConstructionSite>[];

  // 中央 link 的 id
  centerLinkId?: string;
  // 升级 link 的 id
  upgradeLinkId?: string;

  // 基地中心点坐标, [0] 为 x 坐标, [1] 为 y 坐标
  center: [number, number];
  // 基地中心的待选位置, [0] 为 x 坐标, [1] 为 y 坐标
  centerCandidates?: [number, number][];
  // 是否关闭自动布局，该值为 true 时将不会对本房间运行自动布局
  noLayout: boolean;

  // 建筑工的当前工地目标，用于保证多个建筑工的工作统一以及建筑工死后不会寻找新的工地
  constructionSiteId: string;
  // 建筑工特有，当前正在修建的建筑类型，用于在修建完成后触发对应的事件
  constructionSiteType?: StructureConstant;
  // 建筑工地的坐标，用于在建造完成后进行 lookFor 来确认其是否成功修建了建筑
  constructionSitePos: number[];

  // 当前被 repairer 或 tower 关注的墙
  focusWall: {
    id: string;
    endTime: number;
  };

  // 中央集群的资源转移任务队列
  centerTransferTasks: ITransferTask[];

  // 房间物流任务队列
  transferTasks: RoomTransferTasks[];

  // 当前房间所处的防御模式
  // defense 为基础防御，active 为主动防御，该值未定义时为日常模式
  defenseMode?: "defense" | "active";

  // 外矿专用内存字段
  remote: {
    // 外矿房间名
    [roomName: string]: {
      // 该外矿什么时候可以恢复采集，在被入侵时触发
      disableTill?: number;
      // 该外矿要把能量运到哪个建筑里，保存下来是为了后面方便自动恢复外矿采集
      targetId: string;
    };
  };

  // 终端监听矿物列表
  // 数组中每一个字符串都代表了一个监听任务，形如 "0 0 power"，第一位对应 TerminalModes，第二位对应 TerminalChannels，第三位对应资源类型
  terminalTasks: string[];
  // 房间内终端缓存的订单id
  targetOrderId?: string;
  // 房间内终端要立刻支援的房间名
  targetSupportRoom?: string;
  // 当前终端要监听的资源索引
  terminalIndex: number;

  // 该房间要执行的资源共享任务
  shareTask: IRoomShareTask;

  /**
   * lab 集群所需的信息
   * @see doc/lab设计案
   */
  lab?: LabMemory;

  /**
   * 战争状态
   */
  war?: Record<string, unknown>;

  /**
   * boost 强化任务
   * @see doc/boost设计案
   */
  boost?: BoostTask;
}

interface LabMemory {
  // 当前集群的工作状态
  state: string;
  // 当前生产的目标产物索引
  targetIndex: number;
  // 当前要生产的数量
  targetAmount?: number;
  // 底物存放 lab 的 id
  inLab: string[];
  // 产物存放 lab 的 id
  outLab: {
    [labId: string]: number;
  };
  // 反应进行后下次反应进行的时间，值为 Game.time + cooldown
  reactionRunTime?: number;
  // lab 是否暂停运行
  pause: boolean;
}

// 房间要执行的资源共享任务
// 和上面的资源共享任务的不同之处在于，该任务是发布在指定房间上的，所以不需要 source
interface IRoomShareTask {
  // 资源的接受房间
  target: string;
  // 共享的资源类型
  resourceType: ResourceConstant;
  // 期望数量
  amount: number;
}

interface FlagMemory {
  // deposit 旗帜特有，最长冷却时间
  depositCooldown?: number;
  // 公路房旗帜特有，抵达目标需要的时间
  travelTime?: number;
  // 公路房旗帜特有，travelTime 是否已经计算完成
  travelComplete?: boolean;
  // 该旗帜下标注的资源 id
  sourceId?: string;

  // 当前 powerbank 采集的状态
  state?: string;

  // 因为外矿房间有可能没视野
  // 所以把房间名缓存进内存
  roomName?: string;

  /**
   * 路径点旗帜中生效
   * 用于指定下一个路径点的旗帜名
   */
  next: string;
}

interface RoomPosition {
  directionToPos(direction: DirectionConstant): RoomPosition | undefined;
  getFreeSpace(): RoomPosition[];
}

type RoomTransferTasks =
  | IFillExtension
  | IFillTower
  | ILabIn
  | ILabOut
  | IBoostGetResource
  | IBoostGetEnergy
  | IBoostClear
  | IFillNuker;

// 房间物流任务 - 填充拓展
interface IFillExtension {
  type: string;
}

// 房间物流任务 - 填充塔
interface IFillTower {
  type: string;
  id: string;
}

// 房间物流任务 - lab 底物填充
interface ILabIn {
  type: string;
  resource: {
    id: string;
    type: ResourceConstant;
    amount: number;
  }[];
}

// 房间物流任务 - lab 产物移出
interface ILabOut {
  type: string;
  resourceType: ResourceConstant;
}

// 房间物流任务 - boost 资源填充
interface IBoostGetResource {
  type: string;
}

// 房间物流任务 - boost 能量填充
interface IBoostGetEnergy {
  type: string;
}

// 房间物流任务 - boost 资源清理
interface IBoostClear {
  type: string;
}

// 房间物流任务 - 填充核弹
interface IFillNuker {
  type: string;
  id: Id<StructureNuker>;
  resourceType: ResourceConstant;
}

interface StructureController {
  // 检查房间内敌人是否有威胁
  checkEnemyThreat(): boolean;
}

interface transferTaskOperation {
  // creep 工作时执行的方法
  target: (creep: Creep, task: RoomTransferTasks) => boolean;
  // creep 非工作(收集资源时)执行的方法
  source: (creep: Creep, task: RoomTransferTasks, sourceId: string) => boolean;
}

/**
 * creep 发布计划职责链上的一个节点
 *
 * @param detail 该 creep 发布所需的房间信息
 * @returns 代表该发布计划是否适合房间状态
 */
type PlanNodeFunction = (detail: UpgraderPlanStats | HarvesterPlanStats | TransporterPlanStats) => boolean;

// 房间中用于发布 upgrader 所需要的信息
interface UpgraderPlanStats {
  // 房间对象
  room: Room;
  // 房间内的控制器等级
  controllerLevel: number;
  // 控制器还有多久降级
  ticksToDowngrade: number;
  // source 建造好的 container 的 id
  sourceContainerIds: string[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内 terminal 的 id，房间没 terminal 时该值为空，下同
  terminalId?: string;
  // 房间内 upgradeLink 的 id
  upgradeLinkId?: string;
  // storage 中有多少能量
  storageEnergy?: number;
  // terminal 中有多少能量
  terminalEnergy?: number;
}

// 房间中用于发布 harvester 所需要的信息
interface HarvesterPlanStats {
  // 房间对象
  room: Room;
  // 房间内 source 的 id 和其配套的 link id
  sources: {
    id: string;
    linkId: string;
  }[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内中央 link 的 id
  centerLinkId?: string;
}

// 房间中用于发布 filler manager processor 所需要的信息
interface TransporterPlanStats {
  // 房间对象
  room: Room;
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内中央 link 的 id
  centerLinkId?: string;
  // source 建造好的 container 的 id
  sourceContainerIds?: string[];
  // 基地中心点（processor的位置）坐标
  centerPos?: [number, number];
}

// 发布角色配置项需要的素材集合
interface ReleasePlanConstructor<T> {
  // 搜集发布该角色需要的房间信息
  getStats: (room: Room) => T;
  // 发布计划的集合，会根据收集到的房间信息选择具体的计划
  plans: PlanNodeFunction[];
}

// 所有使用发布计划的角色
interface CreepReleasePlans {
  harvester: ReleasePlanConstructor<HarvesterPlanStats>;
  upgrader: ReleasePlanConstructor<UpgraderPlanStats>;
  transporter: ReleasePlanConstructor<TransporterPlanStats>;
}

/**
 * 建筑拓展
 */
interface Structure {
  // 是否为自己的建筑，某些建筑不包含此属性，也可以等同于 my = false
  my?: boolean;
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param instanceName 发送日志的实例名
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  log(content: string, color?: Colors, notify?: boolean): void;
  // 建筑的工作方法
  work?(): void;
  // 建筑在完成建造时触发的回调
  onBuildComplete?(): void;
}

type CenterStructures = STRUCTURE_STORAGE | STRUCTURE_TERMINAL | STRUCTURE_FACTORY | "centerLink";

/**
 * 房间中央物流 - 资源转移任务
 */
interface ITransferTask {
  // 任务提交者类型
  // number 类型是为了运行玩家自己推送中央任务
  submit: CenterStructures | number;
  // 资源的提供建筑类型
  source: CenterStructures;
  // 资源的接受建筑类型
  target: CenterStructures;
  // 资源类型
  resourceType: ResourceConstant;
  // 资源数量
  amount: number;
}

interface StructureTerminal {
  addTask(
    resourceType: ResourceConstant,
    amount: number,
    mod?: TerminalModes,
    channel?: TerminalChannels,
    priceLimit?: number
  ): void;
  add(
    resourceType: ResourceConstant,
    amount: number,
    mod?: TerminalModes,
    channel?: TerminalChannels,
    priceLimit?: number
  ): string;
  removeByType(type: ResourceConstant, mod: TerminalModes, channel: TerminalChannels): void;
  remove(index: number): string;
  show(): string;
}

/**
 * 终端监听规则类型
 * 具体值详见 ./setting.ts > terminalModes
 */
type ModeGet = 0;
type ModePut = 1;
type TerminalModes = ModeGet | ModePut;

/**
 * 终端监听规则的资源渠道
 * 具体值详见 ./setting.ts > terminalChannels
 */
type ChannelTake = 0;
type ChannelRelease = 1;
type ChannelShare = 2;
type ChannelSupport = 3;
type TerminalChannels = ChannelTake | ChannelRelease | ChannelShare | ChannelSupport;

// 终端监听任务，详见 doc/终端设计案
interface TerminalListenerTask {
  // 要监听的资源类型
  type: ResourceConstant;
  // 期望数量
  amount: number;
  // 监听类型
  mod: TerminalModes;
  // 渠道: market, share
  channel: TerminalChannels;
  // 价格限制
  priceLimit?: number;
  // 要支援的房间名
  supportRoomName?: string;
}

/**
 * 交易的合理范围
 * 将以昨日该资源的交易范围为基准，上(MAX)下(MIN)浮动出一个区间，超过该区间的订单将被不会交易
 * 如果没有特别指定的话将以 default 指定的区间为基准
 */
type DealRatios = {
  [resType in ResourceConstant | "default"]?: {
    // 卖单的最高价格
    MAX: number;
    // 买单的最低价格
    MIN: number;
  };
};

/**
 * 包含 store 属性的建筑
 */
type StructureWithStore =
  | StructureStorage
  | StructureContainer
  | StructureExtension
  | StructureFactory
  | StructureSpawn
  | StructurePowerSpawn
  | StructureLink
  | StructureTerminal
  | StructureNuker;

/**
 * 自定义移动的选项
 */
interface MoveOpt {
  /**
   * 重用距离，等同于 moveTo 的 reusePath
   */
  reusePath?: number;

  /**
   * 要移动到目标位置的距离
   */
  range?: number;

  /**
   * 是否禁用对穿（为 true 则会躲避 creep，默认为 false）
   */
  disableCross?: boolean;

  /**
   * 移动目标所在的 shard（不填则默认为本 shard）
   */
  shard?: ShardName;

  /**
   * 路径点
   * 传入形如 [ '12 21 E1N1', '12 21 E2N2' ] 的路径点数组
   * 或是任意路径旗帜名前缀
   */
  wayPoint?: string[] | string;

  /**
   * 最大的搜索成本
   */
  maxOps?: number;

  /**
   * 是否检查目标发生了变化，为 true 的话会每 tick 检查目标位置是否变化
   * 一旦变化则会立刻重新规划
   */
  checkTarget?: boolean;

  /**
   * 是否禁用路径缓存
   * 当 creep 因为对方拒绝对穿而重新寻路时，就需要开启该选项
   * 否则如果恰好有缓存的路径经过了拒绝对穿者，那该 creep 就会由于使用了该缓存从而不停的撞击拒绝对穿的单位
   */
  disableRouteCache?: boolean;
}

/**
 * 移动的内存数据
 */
interface MoveInfo {
  /**
   * 序列化之后的路径信息
   */
  path?: string;

  /**
   * 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞停
   */
  prePos?: string;

  /**
   * 上一次移动的方向，用于在下个 tick 发现移动失败时检查前面时什么东西
   */
  lastMove?: DirectionConstant;

  /**
   * 要移动到的目标位置，creep 会用这个字段判断目标是否变化了
   */
  targetPos?: string;

  /**
   * 数组形式传入的路径点
   */
  wayPoints?: string[];

  /**
   * 路径旗帜名（包含后面的编号，如 waypoint1 或者 waypoint99）
   */
  wayPointFlag?: string;
}

// 目前官服存在的所有 shard 的名字
type ShardName = "shard0" | "shard1" | "shard2" | "shard3";

// 跨 shard 请求构造器
interface CrossShardRequestConstructor<RequestType, RequestData> {
  // 要处理请求的 shard
  to: ShardName;
  // 该请求的类型
  type: RequestType;
  // 该请求携带的数据
  data: RequestData;
}

/**
 * 跨 shard 请求 - 发送 creep
 */
type SendCreep = "sendCreep";
interface SendCreepData {
  // 要发送 creep 的名字
  name: string;
  // 要发送 creep 的内存
  memory: CreepMemory;
}

/**
 * 跨 shard 请求 - 提交重新孵化任务
 */
type SendRespawn = "sendRespawn";
interface SendRespawnData {
  // 要重新孵化的 creep 的名字
  name: string;
  // 要重新孵化的 creep 的内存
  memory: CreepMemory;
}

// 构造所有的跨 shard 请求
type CrossShardRequest =
  | CrossShardRequestConstructor<SendCreep, SendCreepData>
  | CrossShardRequestConstructor<SendRespawn, SendRespawnData>;

// 所有跨 shard 请求的类型和数据
type CrossShardRequestType = SendCreep | SendRespawn;
type CrossShardRequestData = SendCreepData | SendRespawnData;

// 所有跨 shard 请求的执行策略
type CrossShardRequestStrategies = {
  [type in CrossShardRequestType]: (data: CrossShardRequestData) => ScreepsReturnCode;
};

// 镜面的跨 shard 数据
type InterShardData = {
  [shard in ShardName]?: {
    // 一个键值对构成了一个消息
    [msgName: string]: CrossShardRequest | ScreepsReturnCode;
  };
};

// 跨 shard 响应
interface CrossShardReply {
  // 响应是否存在
  has: boolean;
  // 响应的状态
  result?: ScreepsReturnCode;
}

// 跨 shard 请求的元数据
interface CrossShardRequestInfo {
  // 请求的发送 shard
  source: ShardName;
  // 请求的名称
  name: string;
}

/**
 * 是否允许对穿
 *
 * @param creep 被对穿的 creep
 * @param requireCreep 发起对穿的 creep
 * @return 为 true 时允许对穿
 */
type AllowCrossRuleFunc = (creep: Creep | PowerCreep, requireCreep: Creep | PowerCreep) => boolean;

/**
 * 对穿请求的规则集合
 *
 * 键为 creep 的角色类型，值为一个返回 boolean 的方法
 * 该方法用于判断有其他 creep 向该 creep 发起对穿时是否同意对穿，在寻路时也会使用该方法确定是否要绕过一个 creep
 * 该方法为空则使用默认规则（键为 default）
 */
type CrossRules = {
  [role in CreepRoleConstant | "default"]?: AllowCrossRuleFunc;
};

/**
 * 建筑规划结果
 *
 * 每种建筑（键）都对应一个建筑位置二维数组（值）
 * 后面的二维数组第一层代表 RCL 等级，第二层包含了该 RCL 时应该建造的位置信息
 */
type StructurePlanningResult = {
  // 该类型建筑应该被放置在什么地方
  [structureType in BuildableStructureConstant]?: RoomPosition[] | null;
}[];

/**
 * 全局建筑规划缓存
 * 键为房间名，值为对应的规划结果
 */
interface StructurePlanningCache {
  [roomName: string]: StructurePlanningResult;
}

/**
 * 目前存在的所有有效 RCL 等级
 */
type AvailableLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/**
 * 要建造工地的位置
 */
interface ConstructionPos<StructureType extends BuildableStructureConstant = BuildableStructureConstant> {
  // 要建造到的位置
  pos: RoomPosition;
  // 要建造的建筑类型
  type: StructureType;
}

// 反应底物表接口
interface IReactionSource {
  [targetResourceName: string]: string[];
}

/**
 * 强化配置项
 * 详情 doc/boost 强化案
 */
interface IBoostConfig {
  [resourceType: string]: number;
}

/**
 * boost 任务阶段
 * 仅在房间的 LAB_STATE 为 boost 时有效
 *
 * @type boostGet 获取资源, boost 进程的默认阶段
 * @type labGetEnergy 获取能量, 有 lab 能量不足时触发
 * @type waitBoost 等待强化，lab 在该阶段会一直等待直到 creep 调用强化
 * @type boostClear 清除资源，在强化完成后打扫 lab
 */
type BoostStats = "boostGet" | "labGetEnergy" | "waitBoost" | "boostClear";

/**
 * boost 资源配置类型
 *
 * @type WAR 对外战争
 * @type DEFENSE 主动防御
 */
type BoostType = "WAR" | "DEFENSE";

/**
 * boost 资源配置表
 * 规定了不同模式下需要往 lab 装填的资源类型
 */
type BoostResourceConfig = {
  [type in BoostType]: ResourceConstant[];
};

/**
 * 强化任务
 * 存放了房间进行 boost 所需的数据
 */
interface BoostTask {
  // 当前任务的所处状态
  state: BoostStats;
  // 进行 boost 强化的位置
  pos: number[];
  // 要进行强化的材料以及执行强化的 lab
  lab: {
    [resourceType: string]: string;
  };
  // 本次强化任务所用的类型
  type: BoostType;
}

interface ICreepStage {
  isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
  prepare?: (creep: Creep) => boolean;
  source?: (creep: Creep) => boolean;
  target?: (creep: Creep) => boolean;
}
