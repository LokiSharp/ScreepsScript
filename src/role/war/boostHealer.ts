import { boostPrepare } from "@/utils/creep/boostPrepare";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 强化 - HEAL
 * 7 级以上可用, 25HEAL 25MOVE
 */
export const boostHealer: CreepConfig<"boostHealer"> = {
  isNeed: (room, preMemory) => preMemory.data.keepSpawn,
  prepare: creep => {
    // 治疗单位不允许发起对穿
    if (!creep.memory.disableCross) creep.memory.disableCross = true;

    return boostPrepare().prepare(creep);
  },
  ...inPlaceBase(),
  target: creep => {
    const { creepName } = creep.memory.data;
    const target = Game.creeps[creepName];
    if (!target) {
      creep.say("💤");
      return false;
    }
    creep.healTo(target);
    return false;
  },
  bodys: () => calcBodyPart({ [TOUGH]: 12, [HEAL]: 25, [MOVE]: 10 })
};
