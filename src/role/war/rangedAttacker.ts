import { battleBase } from "@/utils/creep/battleBase";
import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 远程作战单位
 */
export const rangedAttacker: CreepConfig<"rangedAttacker"> = {
  // 组装 CreepConfig
  ...battleBase(),
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
      const structures = targetFlag.pos.lookFor(LOOK_STRUCTURES);

      if (structures.length > 0) {
        if (creep.rangedAttack(structures[0]) === ERR_NOT_IN_RANGE) creep.moveTo(structures[0]);
      } else if (creep.rangedAttackNearestHostileCreeps() === OK) return false;
      else if (creep.rangedAttackNearHostileStructures() === OK) return false;
    } else {
      creep.log(`不在指定房间，切入迁徙模式`);
      return true;
    }
    return false;
  },
  bodys: createBodyGetter(bodyConfigs.rangedAttacker)
};
