import { getBodyConfig } from "utils/getBodyConfig";

// 每个房间最多同时存在多少单位
export const MAX_UPGRADER_NUM = 4;
export const MAX_HARVESTER_NUM = 4;
export const MAX_BUILDER_NUM = 2;
export const MAX_RUIN_COLLECTOR_NUM = 2;

// 造好新墙时 builder 会先将墙刷到超过下面值，之后才会去建其他建筑
export const MIN_WALL_HITS = 8000;

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
    { [WORK]: 14, [CARRY]: 1, [MOVE]: 7 },
    { [WORK]: 18, [CARRY]: 1, [MOVE]: 9 },
    { [WORK]: 32, [CARRY]: 1, [MOVE]: 17 },
    { [WORK]: 32, [CARRY]: 1, [MOVE]: 17 }
  ),

  /**
   * 工作单位
   * 诸如 builder 之类的
   */
  worker: getBodyConfig(
    { [WORK]: 1, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 2, [CARRY]: 3, [MOVE]: 4 },
    { [WORK]: 3, [CARRY]: 5, [MOVE]: 5 },
    { [WORK]: 5, [CARRY]: 8, [MOVE]: 8 },
    { [WORK]: 8, [CARRY]: 10, [MOVE]: 10 },
    { [WORK]: 11, [CARRY]: 12, [MOVE]: 12 },
    { [WORK]: 16, [CARRY]: 16, [MOVE]: 16 },
    { [WORK]: 17, [CARRY]: 16, [MOVE]: 17 }
  ),
  /**
   * 升级单位
   * 最大的身体部件只包含 12 个 WORK
   */
  upgrader: getBodyConfig(
    { [WORK]: 1, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 2, [CARRY]: 3, [MOVE]: 4 },
    { [WORK]: 3, [CARRY]: 5, [MOVE]: 5 },
    { [WORK]: 5, [CARRY]: 8, [MOVE]: 8 },
    { [WORK]: 8, [CARRY]: 10, [MOVE]: 10 },
    { [WORK]: 11, [CARRY]: 12, [MOVE]: 12 },
    { [WORK]: 16, [CARRY]: 16, [MOVE]: 16 },
    { [WORK]: 12, [CARRY]: 12, [MOVE]: 12 }
  ),

  /**
   * 房间物流管理单位
   * 负责转移基地资源的 creep
   */
  manager: getBodyConfig(
    { [CARRY]: 3, [MOVE]: 3 },
    { [CARRY]: 7, [MOVE]: 4 },
    { [CARRY]: 10, [MOVE]: 6 },
    { [CARRY]: 17, [MOVE]: 9 },
    { [CARRY]: 24, [MOVE]: 12 },
    { [CARRY]: 30, [MOVE]: 15 },
    { [CARRY]: 32, [MOVE]: 16 },
    { [CARRY]: 32, [MOVE]: 16 }
  )
};

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
  role: "harvester",
  ready: false,
  working: false
};

// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = ["harvester", "filler"];

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
