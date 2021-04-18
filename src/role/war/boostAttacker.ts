import { battleBase } from "@/utils/creep/battleBase";
import { boostPrepare } from "@/utils/creep/boostPrepare";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 强化 - 士兵
 * 7 级以上可用, 12TOUGH 28ATTACK 10MOVE
 */
export const boostAttacker: CreepConfig<"boostAttacker"> = {
  ...battleBase(),
  ...boostPrepare(),
  ...inPlaceBase(),
  target: creep => {
    const { targetFlagName } = creep.memory.data;
    creep.attackFlag(targetFlagName);

    const targetFlag = creep.getFlag(targetFlagName);
    if (!targetFlag) {
      creep.say("旗呢?");
      return false;
    }

    return creep.room.name !== targetFlag.pos.roomName;
  },
  bodys: () => calcBodyPart({ [TOUGH]: 12, [ATTACK]: 28, [MOVE]: 10 })
};
