/**
 * 房间内存
 */
interface RoomMemory {
  // 该房间发起移除操作的时间
  // 执行移除时会检查该时间，如果已经过期的话将不会执行移除操作
  removeTime?: number;
  // 该房间的生产队列，元素为 creepConfig 的键名
  spawnList?: string[];
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

  // 中央集群的资源转移任务队列
  centerTransferTasks: ITransferTask[];

  /**
   * 房间物流任务队列
   */
  transferTasks: RoomTransportTasks[];

  /**
   * 房间物流任务的备份数据
   * 会在全局重置时通过该数据重建物流任务
   */
  transport: string;

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
   * 升级状态
   */
  upgrade?: Record<string, unknown>;

  /**
   * boost 强化任务
   */
  boost?: BoostTask;

  // powerSpawn 是否暂停
  pausePS?: boolean;

  // power 任务请求队列
  // 由建筑物发布，powerCreep 查找任务时会优先读取该队列
  powerTasks: PowerConstant[];

  // 由驻守在房间中的 pc 发布，包含了 pc 拥有对应的能力
  // 形如: "1 3 13 14"，数字即为对应的 PWR_* 常量
  powers?: string;

  // 工厂内存
  factory: {
    // 当前房间的等级，由用户指定
    level?: 1 | 2 | 3 | 4 | 5;
    // 下个顶级产物索引
    targetIndex: number;
    // 本工厂参与的生产线类型
    depositTypes?: DepositConstant[];
    // 当该字段为真并且工厂在冷却时，就会执行一次底物是否充足的检查，执行完就会直接将该值移除
    produceCheck?: boolean;
    // 当前工厂所处的阶段
    state: string;
    // 工厂生产队列
    taskList: IFactoryTask[];
    // 工厂是否即将移除
    // 在该字段存在时，工厂会搬出所有材料，并在净空后移除 room.factory 内存
    // 在净空前手动删除该字段可以终止移除进程
    remove?: true;
    // 工厂是否暂停，该属性优先级高于 sleep，也就是说 sleep 结束的时候如果有 pause，则工厂依旧不会工作
    pause?: true;
    // 工厂休眠时间，如果该时间存在的话则工厂将会待机
    sleep?: number;
    // 休眠的原因
    sleepReason?: string;
    // 玩家手动指定的目标，工厂将一直合成该目标
    specialTraget?: CommodityConstant;
  };

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
}
