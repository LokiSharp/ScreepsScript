import { battleBase } from "utils/creep/battleBase";
import { boostPrepare } from "utils/creep/boostPrepare";
import calcBodyPart from "utils/creep/calcBodyPart";
import { inPlaceBase } from "../../utils/creep/inPlaceBase";

/**
 * 强化 - 远程作战单位
 * 本角色仅能在 RCL >= 7 时生成
 * 扛塔数量为 0 时依旧会携带 3 个强化 HEAL (144/T 的回复)，但是不会有 TOUGH
 */
export const boostRangedAttacker: CreepConfig<"boostRangedAttacker"> = {
  // 组装 CreepConfig
  ...battleBase(),
  ...boostPrepare(),
  ...inPlaceBase(),
  target: creep => {
    const { targetFlagName } = creep.memory.data;
    // 获取旗帜
    const targetFlag = creep.getFlag(targetFlagName);
    if (!targetFlag) {
      creep.say("旗呢?");
      return false;
    }

    // 治疗自己，不会检查自己生命值，一直治疗
    // 因为本 tick 受到的伤害只有在下个 tick 才能发现，两个 tick 累计的伤害足以击穿 tough。
    if (creep.getActiveBodyparts(HEAL)) creep.heal(creep);

    // 如果 creep 不在房间里 则一直向旗帜移动
    if (!targetFlag.room || (targetFlag.room && creep.room.name !== targetFlag.room.name)) {
      // 如果 healer 存在则只会在 healer 相邻且可以移动时才进行移动
      creep.goTo(targetFlag.pos, {
        checkTarget: true
      });
    }

    if (creep.room.name === targetFlag.pos.roomName) {
      const hostileCreeps = creep.getHostileCreepsWithCache();
      const structures = targetFlag.pos.lookFor(LOOK_STRUCTURES);

      if (creep.rangedAttackLowestHitsHostileCreeps(hostileCreeps) === OK) return false;
      else if (structures.length > 0) {
        if (creep.rangedAttack(structures[0]) === ERR_NOT_IN_RANGE) creep.moveTo(structures[0]);
      } else if (creep.rangedAttackNearestHostileCreeps() === OK) return false;
      else if (creep.rangedAttackNearHostileStructures() === OK) return false;
    } else {
      creep.log(`不在指定房间，切入迁徙模式`);
      return true;
    }
    return false;
  },
  bodys: (room, spawn, data) => {
    // 越界就置为 6
    if (data.bearTowerNum < 0 || data.bearTowerNum > 6) data.bearTowerNum = 6;
    // 扛塔等级和bodyPart的对应关系
    const bodyMap = {
      0: { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
      1: { [TOUGH]: 2, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 5 },
      2: { [TOUGH]: 4, [RANGED_ATTACK]: 20, [MOVE]: 9, [HEAL]: 9 },
      3: { [TOUGH]: 6, [RANGED_ATTACK]: 21, [MOVE]: 10, [HEAL]: 13 },
      4: { [TOUGH]: 8, [RANGED_ATTACK]: 15, [MOVE]: 10, [HEAL]: 17 },
      5: { [TOUGH]: 10, [RANGED_ATTACK]: 9, [MOVE]: 10, [HEAL]: 21 },
      6: { [TOUGH]: 12, [RANGED_ATTACK]: 5, [MOVE]: 10, [HEAL]: 23 }
    };
    const bodyConfig: BodySet = bodyMap[data.bearTowerNum];

    return calcBodyPart(bodyConfig);
  }
};
