/**
 * 房间内存
 */
interface RoomMemory {
  // 该房间发起移除操作的时间
  // 执行移除时会检查该时间，如果已经过期的话将不会执行移除操作
  removeTime?: number;
  // 该房间的生产队列，元素为 creepConfig 的键名
  // 需要放置的工地（CS）队列
  delayCSList: string[];

  sourceContainersIds: Id<StructureContainer>[];
  constructionSiteIds: Id<ConstructionSite>[];

  // 中央 link 的 id
  centerLinkId?: Id<StructureLink>;
  // 升级 link 的 id
  upgradeLinkId?: Id<StructureLink>;

  // 基地中心点坐标, [0] 为 x 坐标, [1] 为 y 坐标
  center: [number, number];
  // 基地中心的待选位置, [0] 为 x 坐标, [1] 为 y 坐标
  centerCandidates?: [number, number][];
  // 是否关闭自动布局，该值为 true 时将不会对本房间运行自动布局
  noLayout: boolean;

  // observer 内存
  observer: {
    // 上个 tick 已经 ob 过的房间名
    checkRoomName?: string;
    // 遍历 watchRooms 所使用的索引
    watchIndex: number;
    // 监听的房间列表
    watchRooms: string[];
    // 当前已经找到的 powerBank 和 deposit 旗帜名数组，会自动进行检查来移除消失的旗帜信息
    pbList: string[];
    depoList: string[];
    // 是否暂停，为 true 时暂停
    pause?: boolean;
  };

  // 建筑工的当前工地目标，用于保证多个建筑工的工作统一以及建筑工死后不会寻找新的工地
  constructionSiteId: Id<ConstructionSite>;
  // 建筑工特有，当前正在修建的建筑类型，用于在修建完成后触发对应的事件
  constructionSiteType?: StructureConstant;
  // 建筑工地的坐标，用于在建造完成后进行 lookFor 来确认其是否成功修建了建筑
  constructionSitePos: number[];

  // 当前被 repairer 或 tower 关注的墙
  focusWall: {
    id: Id<StructureWall | StructureRampart>;
    endTime: number;
  };

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
      targetId: Id<StructureWithStore>;
    };
  };

  // 终端监听矿物列表
  // 数组中每一个字符串都代表了一个监听任务，形如 "0 0 power"，第一位对应 TerminalModes，第二位对应 TerminalChannels，第三位对应资源类型
  terminalTasks: string[];
  // 房间内终端缓存的订单id
  targetOrderId?: Id<Order>;
  // 房间内终端要立刻支援的房间名
  targetSupportRoom?: string;
  // 当前终端要监听的资源索引
  terminalIndex: number;

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
   * 升级状态
   */
  upgrade?: Record<string, unknown>;

  /**
   * boost 强化任务
   */
  boost?: BoostTask;

  // powerSpawn 是否暂停
  pausePS?: boolean;

  // 工厂内存
  factory: FactoryMemory;

  // 一个游戏时间，标注了 mineral 什么时候会回满
  // 由 miner 发布，Extractor 会监听这个字段，并在适当的时间重新发布 mineral
  mineralCooldown: number;

  /**
   * storage 要在其他建筑里维持的能量
   * 目前只支持 terminal
   */
  resourceKeepInfo?: {
    terminal?: IResourceKeepInfo;
  };

  /**
   * 当前本房间物流单位的数量
   */
  transporterNumber?: number;

  // 目标敌方建筑缓存
  targetHostileStructuresCache: Id<Structure>[];
  targetHostileStructuresCacheExpireTime: number;
  // 目标敌方 creep 缓存
  targetHostileCreepsCache: Id<AnyCreep>[];
  targetHostileCreepsCacheExpireTime: number;
  // 可以重新占领，刷 RCL 用
  canReClaim?: boolean;
  upgradePosInfos: Record<string, UpgradePosInfo>;
}

interface UpgradePosInfo {
  x: number;
  y: number;
  creepId: Id<Creep>;
  rangeToController: number;
  rangeToStorage: number;
  rangeToTerminal: number;
}

/**
 * 房间拓展
 */
interface Room {
  log(content: string, instanceName?: string, color?: Colors | undefined, notify?: boolean): void;

  // pos 处理 api
  serializePos(pos: RoomPosition): string;
  unserializePos(posStr: string): RoomPosition | undefined;

  // 资源共享 api
  giver(roomName: string, resourceType: ResourceConstant, amount?: number): string;

  // boost api
  boost(
    boostType: string,
    boostConfig: IBoostConfig
  ): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_ARGS | ERR_NOT_ENOUGH_RESOURCES;
  boostCreep(creep: Creep): OK | ERR_NOT_FOUND | ERR_BUSY | ERR_NOT_IN_RANGE;

  // 战争相关
  startWar(boostType: BoostType): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET;

  stopWar(): OK | ERR_NOT_FOUND;

  // 升级相关
  startUpgrade(): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET;

  stopUpgrade(): OK | ERR_NOT_FOUND;

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

  // 自动规划相关
  findBaseCenterPos(): RoomPosition[];
  confirmBaseCenter(targetPos?: RoomPosition[]): RoomPosition | ERR_NOT_FOUND;
  setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS;
  planLayout(): string;
  clearStructure(): OK | ERR_NOT_FOUND;
  addRemote(remoteRoomName: string, targetId: Id<StructureWithStore>): OK | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  removeRemote(remoteRoomName: string, removeFlag?: boolean): OK | ERR_NOT_FOUND;
  claimRoom(targetRoomName: string, signText?: string): OK;
  registerContainer(container: StructureContainer): OK;
}
