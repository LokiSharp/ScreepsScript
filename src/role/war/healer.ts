import { bodyConfigs } from "setting";
import createBodyGetter from "utils/createBodyGetter";

/**
 * 医生
 * 一直治疗给定的 creep
 */
export default (data: HealUnitData): ICreepConfig => ({
  isNeed: () => data.keepSpawn,
  prepare: creep => {
    // 治疗单位不允许发起对穿
    creep.memory.disableCross = true;
    return true;
  },
  target: creep => {
    const target = Game.creeps[data.creepName];
    if (!target) {
      creep.say("💤");
      return false;
    }
    creep.healTo(target);
    return false;
  },
  bodys: createBodyGetter(bodyConfigs.healer)
});
