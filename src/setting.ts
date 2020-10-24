import { getBodyConfig } from "utils/getBodyConfig";

// 每个房间最多同时存在多少单位
export const MAX_UPGRADER_NUM = 24;
export const MAX_HARVESTER_NUM = 4;
export const MAX_RUIN_COLLECTOR_NUM = 1;
// tower 将在几级之后参与刷墙
export const TOWER_FILL_WALL_LEVEL = 6;

// RCL 几级时开始放置外墙
export const LEVEL_START_BUILD_RAMPART = 3;

// RCL 几级的时候开始放置通向 [ source, controller, mineral ] 的道路
// 注意这个顺序要和 src\modules\autoPlanning\planRoad.ts 的默认方法返回值保持一致
export const LEVEL_BUILD_ROAD = [3, 4, 6];

export const TRANSFER_DEATH_LIMIT = 20;

// 造好新墙时 builder 会先将墙刷到超过下面值，之后才会去建其他建筑
export const MIN_WALL_HITS = 8000;
// 设置 tower 刷墙上限，避免前期过多刷墙
export const MAX_WALL_HITS = 1000000;

// 房间建筑维修需要的设置
export const repairSetting = {
  // 在 tower 的能量高于该值时才会刷墙
  energyLimit: 600,
  // 普通建筑维修的检查间隔
  checkInterval: 4,
  // 墙壁维修的检查间隔
  wallCheckInterval: 3,
  // 墙壁的关注时间
  focusTime: 100
};

/**
 * storage 中的能量和对应发布的 upgrader 数量
 */
export const UPGRADE_WITH_STORAGE = [
  { energy: 900000, num: 10 },
  { energy: 700000, num: 8 },
  { energy: 500000, num: 6 },
  { energy: 300000, num: 4 },
  { energy: 100000, num: 2 }
];

export const bodyConfigs: BodyConfigs = {
  /**
   * 挖矿单位
   * 诸如 harvester 之类的
   */
  harvester: getBodyConfig(
    { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 4, [CARRY]: 1, [MOVE]: 2 },
    { [WORK]: 6, [CARRY]: 1, [MOVE]: 3 },
    { [WORK]: 10, [CARRY]: 1, [MOVE]: 5 },
    { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
    { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
    { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 },
    { [WORK]: 12, [CARRY]: 1, [MOVE]: 6 }
  ),

  /**
   * 工作单位
   * 诸如 builder 之类的
   */
  worker: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 5, [CARRY]: 5, [MOVE]: 5 },
    { [WORK]: 8, [CARRY]: 8, [MOVE]: 8 },
    { [WORK]: 10, [CARRY]: 10, [MOVE]: 10 },
    { [WORK]: 16, [CARRY]: 16, [MOVE]: 16 },
    { [WORK]: 18, [CARRY]: 18, [MOVE]: 18 }
  ),

  /**
   * 升级单位
   * 最大的身体部件只包含 12 个 WORK
   */
  upgrader: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 5, [CARRY]: 5, [MOVE]: 5 },
    { [WORK]: 8, [CARRY]: 8, [MOVE]: 8 },
    { [WORK]: 10, [CARRY]: 10, [MOVE]: 10 },
    { [WORK]: 16, [CARRY]: 16, [MOVE]: 16 },
    { [WORK]: 12, [CARRY]: 12, [MOVE]: 12 }
  ),

  /**
   * 中央物流管理单位
   * 负责转移中央物流的 creep（下面其实前 4 级都用不到，因为中央物流管理员只会在 5 级有了 centerLink 之后才会孵化）
   */
  processor: getBodyConfig(
    { [CARRY]: 4, [MOVE]: 2 },
    { [CARRY]: 6, [MOVE]: 3 },
    { [CARRY]: 10, [MOVE]: 5 },
    { [CARRY]: 16, [MOVE]: 8 },
    { [CARRY]: 20, [MOVE]: 10 },
    { [CARRY]: 20, [MOVE]: 10 },
    { [CARRY]: 20, [MOVE]: 10 },
    { [CARRY]: 20, [MOVE]: 10 }
  ),

  /**
   * 房间物流管理单位
   * 负责转移基地资源的 creep
   */
  transporter: getBodyConfig(
    { [CARRY]: 3, [MOVE]: 3 },
    { [CARRY]: 5, [MOVE]: 5 },
    { [CARRY]: 8, [MOVE]: 8 },
    { [CARRY]: 13, [MOVE]: 13 },
    { [CARRY]: 18, [MOVE]: 18 },
    { [CARRY]: 20, [MOVE]: 20 },
    { [CARRY]: 25, [MOVE]: 25 },
    { [CARRY]: 25, [MOVE]: 25 }
  ),

  /**
   * 外矿预定单位
   */
  reserver: getBodyConfig(
    { [MOVE]: 1, [CLAIM]: 1 },
    { [MOVE]: 1, [CLAIM]: 1 },
    { [MOVE]: 1, [CLAIM]: 1 },
    { [MOVE]: 1, [CLAIM]: 1 },
    { [MOVE]: 2, [CLAIM]: 2 },
    { [MOVE]: 2, [CLAIM]: 2 },
    { [MOVE]: 3, [CLAIM]: 3 },
    { [MOVE]: 5, [CLAIM]: 5 }
  ),

  /**
   * 外矿采集者
   * 和采集者的区别就是外矿采集者拥有更多的 CARRY
   */
  remoteHarvester: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 4, [CARRY]: 6, [MOVE]: 5 },
    { [WORK]: 5, [CARRY]: 9, [MOVE]: 7 },
    { [WORK]: 6, [CARRY]: 10, [MOVE]: 8 },
    { [WORK]: 7, [CARRY]: 15, [MOVE]: 11 },
    { [WORK]: 11, [CARRY]: 15, [MOVE]: 19 }
  ),

  /**
   * 远程支援者
   * 完成支援建设工作的单位
   */
  remoteHelper: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 4, [MOVE]: 3 },
    { [WORK]: 2, [CARRY]: 6, [MOVE]: 4 },
    { [WORK]: 4, [CARRY]: 10, [MOVE]: 7 },
    { [WORK]: 6, [CARRY]: 14, [MOVE]: 10 },
    { [WORK]: 8, [CARRY]: 16, [MOVE]: 12 },
    { [WORK]: 10, [CARRY]: 22, [MOVE]: 16 },
    { [WORK]: 10, [CARRY]: 22, [MOVE]: 16 }
  ),

  /**
   * 基础攻击单位
   * 使用 attack 身体部件的攻击单位
   */
  attacker: getBodyConfig(
    { [MOVE]: 2, [ATTACK]: 2 },
    { [MOVE]: 3, [ATTACK]: 3 },
    { [MOVE]: 4, [ATTACK]: 4 },
    { [MOVE]: 5, [ATTACK]: 5 },
    { [MOVE]: 6, [ATTACK]: 6 },
    { [MOVE]: 7, [ATTACK]: 7 },
    { [MOVE]: 8, [ATTACK]: 8 },
    { [MOVE]: 9, [ATTACK]: 9 }
  )
};

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
  role: "harvester",
  ready: false,
  working: false
};

// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = ["manager", "processor", "harvester", "filler"];

/**
 * 此处定义了所有的房间物流任务类型
 * 每个房间物流的任务的 type 属性都必须是下列定义之一
 */
export const ROOM_TRANSFER_TASK = {
  // 基础运维
  FILL_EXTENSION: "fillExtension",
  FILL_TOWER: "fillTower",
  // nuker 填充
  FILL_NUKER: "fillNuker",
  // lab 物流
  LAB_IN: "labIn",
  LAB_OUT: "labOut",
  LAB_GET_ENERGY: "labGetEnergy",
  FILL_POWERSPAWN: "fillPowerSpawn",
  // boost 物流
  BOOST_GET_RESOURCE: "boostGetResource",
  BOOST_GET_ENERGY: "boostGetEnergy",
  BOOST_CLEAR: "boostClear"
};

// 终端支持的物流模式
export const terminalModes: {
  get: ModeGet;
  put: ModePut;
} = {
  // 获取资源
  get: 0,
  // 提供资源
  put: 1
};

// 终端支持的物流渠道
export const terminalChannels: {
  take: ChannelTake;
  release: ChannelRelease;
  share: ChannelShare;
  support: ChannelSupport;
} = {
  // 拍单
  take: 0,
  // 挂单
  release: 1,
  // 资源共享
  share: 2,
  // 支援
  support: 3
};

// 房间 storage 中的数量超过下面值时
// 该房间就会将自己注册为能量共享的提供房间
export const ENERGY_SHARE_LIMIT = 600000;

/**
 * 交易时的购买区间限制
 * 用于防止过贵的卖单或者太便宜的买单
 * 在进行交易时会通过该资源的昨日历史价格配合下面的比例来确定合适的交易价格区间
 */
export const DEAL_RATIO: DealRatios = {
  default: { MAX: 1.4, MIN: 0.4 },
  // 所有原矿
  [RESOURCE_HYDROGEN]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_OXYGEN]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_UTRIUM]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_LEMERGIUM]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_KEANIUM]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_ZYNTHIUM]: { MAX: 2.5, MIN: 0.3 },
  [RESOURCE_CATALYST]: { MAX: 2.5, MIN: 0.3 }
};

/**
 * 当前使用的基地布局信息
 * 描述了在不同等级时应该将不同建筑放置在何处（相对于基地中心点）
 * 值为 null 代表在集中式布局之外，会自动选择其放置点
 */
export const baseLayout: BaseLayout = [
  {
    [STRUCTURE_SPAWN]: [[-3, 2]]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [-4, 3],
      [-3, 4],
      [-5, 4],
      [-5, 3],
      [-5, 2]
    ]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [-4, 5],
      [-3, 5],
      [-2, 5],
      [-1, 4],
      [-1, 3]
    ],
    [STRUCTURE_TOWER]: [[-2, 1]],
    [STRUCTURE_ROAD]: [
      [-1, 2],
      [-1, 1],
      [-2, 2],
      [-3, 3],
      [-2, 4],
      [-4, 2],
      [-4, 4]
    ]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [-3, 1],
      [-4, 1],
      [1, 4],
      [1, 3],
      [3, 4],
      [4, 3],
      [2, 5],
      [3, 5],
      [4, 5],
      [5, 4]
    ],
    [STRUCTURE_STORAGE]: [[0, 1]],
    [STRUCTURE_ROAD]: [
      [0, 3],
      [1, 2],
      [2, 2],
      [3, 3],
      [2, 4],
      [4, 4]
    ],
    [STRUCTURE_RAMPART]: [
      [-3, 2],
      [0, 1],
      [-2, 1]
    ]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [5, 3],
      [5, 2],
      [4, 1],
      [3, 1],
      [-3, -1],
      [-4, -1],
      [-3, -2],
      [-4, -3],
      [-3, -4],
      [-2, -3]
    ],
    [STRUCTURE_TOWER]: [[0, 2]],
    [STRUCTURE_LINK]: [[-1, 0], null],
    [STRUCTURE_ROAD]: [
      [4, 2],
      [-2, 0],
      [-1, -1],
      [-1, -2],
      [-2, -2],
      [-3, -3],
      [-4, -2],
      [0, 0]
    ],
    [STRUCTURE_RAMPART]: [
      [0, 2],
      [-1, 0]
    ]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [-5, -2],
      [-5, -3],
      [-5, -4],
      [-4, -5],
      [-3, -5],
      [-2, -5],
      [-1, -3],
      [-1, -4],
      [3, -1],
      [4, -1]
    ],
    [STRUCTURE_LAB]: [
      [4, -3],
      [3, -4],
      [2, -3]
    ],
    [STRUCTURE_TERMINAL]: [[1, 0]],
    [STRUCTURE_EXTRACTOR]: [null],
    [STRUCTURE_LINK]: [null],
    [STRUCTURE_ROAD]: [
      [1, 1],
      [2, 0],
      [1, -1],
      [1, -2],
      [0, -3],
      [3, 0],
      [2, -2],
      [3, -3]
    ],
    [STRUCTURE_RAMPART]: [[1, 0]]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [5, -1],
      [5, 1],
      [5, 5],
      [1, 5],
      [-5, 5],
      [-5, 1],
      [-5, -1],
      [-1, -5],
      [-1, 5],
      [-5, -5]
    ],
    [STRUCTURE_TOWER]: [[2, 1]],
    [STRUCTURE_SPAWN]: [[-2, 3]],
    [STRUCTURE_FACTORY]: [[0, -1]],
    [STRUCTURE_LAB]: [
      [3, -2],
      [2, -4],
      [3, -5]
    ],
    [STRUCTURE_LINK]: [null],
    [STRUCTURE_ROAD]: [
      [4, -4],
      [-4, -4],
      [-2, -4],
      [4, 0],
      [-3, 0],
      [-4, 0]
    ],
    [STRUCTURE_RAMPART]: [
      [0, -1],
      [-2, 3],
      [2, 1]
    ]
  },
  {
    [STRUCTURE_EXTENSION]: [
      [1, -4],
      [1, -5]
    ],
    [STRUCTURE_TOWER]: [
      [-2, -1],
      [0, -2],
      [2, -1]
    ],
    [STRUCTURE_LAB]: [
      [4, -2],
      [5, -3],
      [5, -4],
      [4, -5]
    ],
    [STRUCTURE_SPAWN]: [[2, 3]],
    [STRUCTURE_OBSERVER]: [[2, -5]],
    [STRUCTURE_NUKER]: [[5, -5]],
    [STRUCTURE_POWER_SPAWN]: [[3, 2]],
    [STRUCTURE_ROAD]: [
      [3, -4],
      [0, -4],
      [0, 4]
    ],
    [STRUCTURE_RAMPART]: [
      [2, 3],
      [5, -5],
      [-2, -1],
      [0, -2],
      [2, -1]
    ]
  }
];

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
