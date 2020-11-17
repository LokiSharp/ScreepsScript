import { battleBase } from "utils/creep/battleBase";
import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";

/**
 * 拆除者
 * 会一直向旗帜发起进攻，拆除旗帜下的建筑
 */
export default function dismantler(data: WarUnitData): ICreepConfig {
  return {
    ...battleBase(data.targetFlagName, data.keepSpawn),
    target: creep => creep.dismantleFlag(data.targetFlagName, data.healerName),
    bodys: createBodyGetter(bodyConfigs.dismantler)
  };
}
