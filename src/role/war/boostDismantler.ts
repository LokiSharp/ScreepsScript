import { battleBase } from "utils/creep/battleBase";
import { boostPrepare } from "utils/creep/boostPrepare";
import calcBodyPart from "utils/creep/calcBodyPart";

/**
 * 强化 - 拆除者
 * 7 级以上可用, 12TOUGH 28WORK 10MOVE
 */
export const boostDismantler: CreepConfig<"boostDismantler"> = {
  ...battleBase(),
  ...boostPrepare(),
  target: creep => {
    const { targetFlagName, healerName } = creep.memory.data;
    return creep.dismantleFlag(targetFlagName, healerName);
  },
  bodys: () => calcBodyPart({ [TOUGH]: 12, [WORK]: 28, [MOVE]: 10 })
};
