import getBodyConfig from "../utils/creep/getBodyConfig";

// 每个房间最多同时存在多少单位
export const MAX_UPGRADER_NUM = 24;
export const MAX_HARVESTER_NUM = 4;
export const TRANSFER_DEATH_LIMIT = 20;

/**
 * storage 中的能量和对应发布的 upgrader 数量
 */
export const UPGRADE_WITH_STORAGE = [
  { energy: 900000, num: 10 },
  { energy: 700000, num: 9 },
  { energy: 500000, num: 7 },
  { energy: 300000, num: 5 },
  { energy: 100000, num: 3 }
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
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 2 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 4 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 6 },
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
    { [WORK]: 1, [CARRY]: 1, [MOVE]: 2 },
    { [WORK]: 2, [CARRY]: 2, [MOVE]: 4 },
    { [WORK]: 3, [CARRY]: 3, [MOVE]: 6 },
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
    { [CARRY]: 16, [MOVE]: 8 },
    { [CARRY]: 24, [MOVE]: 12 },
    { [CARRY]: 28, [MOVE]: 14 },
    { [CARRY]: 30, [MOVE]: 15 },
    { [CARRY]: 30, [MOVE]: 15 }
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
    { [WORK]: 11, [CARRY]: 15, [MOVE]: 13 }
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
    { [ATTACK]: 2, [MOVE]: 2 },
    { [ATTACK]: 3, [MOVE]: 3 },
    { [ATTACK]: 4, [MOVE]: 4 },
    { [ATTACK]: 5, [MOVE]: 5 },
    { [ATTACK]: 6, [MOVE]: 6 },
    { [ATTACK]: 7, [MOVE]: 7 },
    { [ATTACK]: 16, [MOVE]: 16 },
    { [ATTACK]: 25, [MOVE]: 25 }
  ),

  /**
   * 基础治疗单位
   */
  healer: getBodyConfig(
    { [MOVE]: 1, [HEAL]: 1 },
    { [MOVE]: 1, [HEAL]: 1 },
    { [MOVE]: 2, [HEAL]: 2 },
    { [MOVE]: 4, [HEAL]: 4 },
    { [MOVE]: 6, [HEAL]: 6 },
    { [MOVE]: 7, [HEAL]: 7 },
    { [MOVE]: 16, [HEAL]: 16 },
    { [MOVE]: 25, [HEAL]: 25 }
  ),

  /**
   * 拆除者身体
   */
  dismantler: getBodyConfig(
    { [WORK]: 1, [MOVE]: 2 },
    { [WORK]: 2, [MOVE]: 4 },
    { [WORK]: 4, [MOVE]: 4 },
    { [WORK]: 6, [MOVE]: 6 },
    { [WORK]: 10, [MOVE]: 10 },
    { [WORK]: 15, [MOVE]: 15 },
    { [WORK]: 25, [MOVE]: 25 },
    { [WORK]: 25, [MOVE]: 25 }
  ),

  /**
   * 远程作战单位身体
   */
  rangedAttacker: getBodyConfig(
    { [RANGED_ATTACK]: 1, [MOVE]: 1 },
    { [RANGED_ATTACK]: 1, [MOVE]: 2, [HEAL]: 1 },
    { [RANGED_ATTACK]: 2, [MOVE]: 3, [HEAL]: 1 },
    { [RANGED_ATTACK]: 3, [MOVE]: 5, [HEAL]: 2 },
    { [RANGED_ATTACK]: 6, [MOVE]: 8, [HEAL]: 2 },
    { [RANGED_ATTACK]: 7, [MOVE]: 10, [HEAL]: 3 },
    { [RANGED_ATTACK]: 12, [MOVE]: 20, [HEAL]: 8 },
    { [RANGED_ATTACK]: 15, [MOVE]: 25, [HEAL]: 10 }
  )
};

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
  role: undefined,
  ready: false,
  setWayPoint: false,
  inPlace: false,
  working: false
};

// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = ["harvester", "manager", "processor"];
