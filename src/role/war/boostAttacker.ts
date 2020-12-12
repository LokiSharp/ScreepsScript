import { battleBase } from "utils/creep/battleBase";
import { boostPrepare } from "utils/creep/boostPrepare";
import calcBodyPart from "utils/creep/calcBodyPart";

/**
 * 强化 - 士兵
 * 7 级以上可用, 12TOUGH 28ATTACK 10MOVE
 */
export default function boostAttacker(data: WarUnitData): ICreepConfig {
  return {
    ...battleBase(data.targetFlagName, data.keepSpawn),
    ...boostPrepare(),
    target: creep => {
      creep.attackFlag(data.targetFlagName);

      const targetFlag = creep.getFlag(data.targetFlagName);
      if (!targetFlag) {
        creep.say("旗呢?");
        return false;
      }

      return creep.room.name !== targetFlag.pos.roomName;
    },
    bodys: () => calcBodyPart({ [TOUGH]: 12, [ATTACK]: 28, [MOVE]: 10 })
  };
}
