import calcBodyPart from "@/utils/creep/calcBodyPart";

/**
 * PowerBank 治疗单位
 * 移动并治疗 pbAttacker, 请在 8 级时生成
 */
export const pbHealer: CreepConfig<"pbHealer"> = {
  prepare: creep => {
    // 治疗单位不允许发起对穿
    creep.memory.disableCross = true;
    return true;
  },
  target: creep => {
    const { creepName } = creep.memory.data;
    const targetCreep = Game.creeps[creepName];
    // 对象没了就殉情
    if (!targetCreep) {
      if (!Memory.creeps[creepName]) creep.memory.cantRespawn = true;
      creep.suicide();

      return false;
    }

    // 移动到身边了就治疗
    if (creep.pos.isNearTo(targetCreep)) creep.heal(targetCreep);
    else creep.goTo(targetCreep.pos, { checkTarget: false });
    return false;
  },
  bodys: () => calcBodyPart({ [HEAL]: 25, [MOVE]: 25 })
};
