import { battleBase } from "utils/battleBase";
import { boostPrepare } from "utils/boostPrepare";
import calcBodyPart from "utils/calcBodyPart";

/**
 * 强化 - 拆除者
 * 7 级以上可用, 12TOUGH 28WORK 10MOVE
 */
export default function boostDismantler(data: WarUnitData): ICreepConfig {
  return {
    ...battleBase(data.targetFlagName, data.keepSpawn),
    ...boostPrepare(),
    target: creep => creep.dismantleFlag(data.targetFlagName, data.healerName),
    bodys: () => calcBodyPart({ [TOUGH]: 12, [WORK]: 28, [MOVE]: 10 })
  };
}
