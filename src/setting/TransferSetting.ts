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
 * storage 填充到其他建筑的能量填充设置的下限默认值
 */
export const DEFAULT_ENERGY_KEEP_LIMIT = 900000;

/**
 * storage 填充到其他建筑的能量填充设置的填充量默认值
 */
export const DEFAULT_ENERGY_KEEP_AMOUNT = 50000;
