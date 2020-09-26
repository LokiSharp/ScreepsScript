import { getBodyConfig } from "utils/getBodyConfig";

// 每个房间最多同时存在多少 upgrader 和 harvester
export const MAX_UPGRADER_NUM = 8;
export const MAX_HARVESTER_NUM = 4;

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
   * 工作单位
   * 诸如 harvester、builder 之类的
   */
  worker: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
    { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
    { [WORK]: 7, [CARRY]: 7, [MOVE]: 7 },
    { [WORK]: 12, [CARRY]: 6, [MOVE]: 9 },
    { [WORK]: 20, [CARRY]: 8, [MOVE]: 14 }
  ),
  /**
   * 升级单位
   * 最大的身体部件只包含 12 个 WORK
   */
  upgrader: getBodyConfig(
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 1 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 2 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 3 },
    { [WORK]: 4, [CARRY]: 4, [MOVE]: 4 },
    { [WORK]: 6, [CARRY]: 6, [MOVE]: 6 },
    { [WORK]: 9, [CARRY]: 9, [MOVE]: 9 },
    { [WORK]: 17, [CARRY]: 9, [MOVE]: 17 },
    { [WORK]: 12, [CARRY]: 12, [MOVE]: 12 }
  ),

  /**
   * 房间物流管理单位
   * 负责转移基地资源的 creep
   */
  manager: getBodyConfig(
    { [CARRY]: 2, [MOVE]: 1 },
    { [CARRY]: 3, [MOVE]: 2 },
    { [CARRY]: 4, [MOVE]: 2 },
    { [CARRY]: 5, [MOVE]: 3 },
    { [CARRY]: 8, [MOVE]: 4 },
    { [CARRY]: 14, [MOVE]: 7 },
    { [CARRY]: 20, [MOVE]: 10 },
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