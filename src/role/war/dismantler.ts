import { battleBase } from "utils/battleBase";
import { bodyConfigs } from "setting";
import createBodyGetter from "utils/createBodyGetter";

/**
 * 拆除者
 * 会一直向旗帜发起进攻，拆除旗帜下的建筑
 */
export default (data: WarUnitData): ICreepConfig => ({
  ...battleBase(data.targetFlagName, data.keepSpawn),
  target: creep => creep.dismantleFlag(data.targetFlagName, data.healerName),
  bodys: createBodyGetter(bodyConfigs.dismantler)
});
