import { getBodyConfig } from "utils/getBodyConfig";

// 每个房间最多同时存在多少单位
export const MAX_UPGRADER_NUM = 8;
export const MAX_HARVESTER_NUM = 4;
export const MAX_BUILDER_NUM = 2;
export const MAX_RUIN_COLLECTOR_NUM = 1;

export const TRANSFER_DEATH_LIMIT = 20;

// 造好新墙时 builder 会先将墙刷到超过下面值，之后才会去建其他建筑
export const MIN_WALL_HITS = 8000;
// 设置 tower 刷墙上限，避免前期过多刷墙
export const MAX_WALL_HITS = 300000;

// 房间建筑维修需要的设置
export const repairSetting = {
  // 在 tower 的能量高于该值时才会刷墙
  energyLimit: 600,
  // 普通建筑维修的检查间隔
  checkInterval: 8,
  // 墙壁维修的检查间隔
  wallCheckInterval: 3,
  // 墙壁的关注时间
  focusTime: 100
};

/**
 * storage 中的能量和对应发布的 upgrader 数量
 */
export const UPGRADE_WITH_STORAGE = [
  { energy: 700000, num: 3 },
  { energy: 500000, num: 2 },
  { energy: 100000, num: 1 }
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
    { [CARRY]: 2, [MOVE]: 1 },
    { [CARRY]: 3, [MOVE]: 1 },
    { [CARRY]: 5, [MOVE]: 1 },
    { [CARRY]: 7, [MOVE]: 1 },
    { [CARRY]: 11, [MOVE]: 1 },
    { [CARRY]: 14, [MOVE]: 1 },
    { [CARRY]: 26, [MOVE]: 1 },
    { [CARRY]: 39, [MOVE]: 1 }
  ),

  /**
   * 房间物流管理单位
   * 负责转移基地资源的 creep
   */
  manager: getBodyConfig(
    { [CARRY]: 3, [MOVE]: 3 },
    { [CARRY]: 5, [MOVE]: 5 },
    { [CARRY]: 8, [MOVE]: 8 },
    { [CARRY]: 10, [MOVE]: 10 },
    { [CARRY]: 12, [MOVE]: 12 },
    { [CARRY]: 15, [MOVE]: 15 },
    { [CARRY]: 18, [MOVE]: 18 },
    { [CARRY]: 20, [MOVE]: 20 }
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
  )
};

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
  role: "harvester",
  ready: false,
  working: false
};

// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = ["harvester", "filler", "manager", "processor"];

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
