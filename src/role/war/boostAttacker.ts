import { boostPrepare } from "utils/creep/boostPrepare";
import calcBodyPart from "utils/creep/calcBodyPart";

/**
 * 强化 - 士兵
 * 7 级以上可用, 12TOUGH 28ATTACK 10MOVE
 */
export default function boostAttacker(data: WarUnitData): ICreepConfig {
  return {
    isNeed: () => data.keepSpawn,
    ...boostPrepare(),
    target: creep => {
      creep.attackFlag(data.targetFlagName);

      const targetFlag = creep.getFlag(data.targetFlagName);
      if (!targetFlag) {
        creep.say("旗呢?");
        return false;
      }

      if (creep.room.name !== targetFlag.pos.roomName) {
        return true;
      }
      return false;
    },
    bodys: () => calcBodyPart({ [TOUGH]: 12, [ATTACK]: 28, [MOVE]: 10 })
  };
}
