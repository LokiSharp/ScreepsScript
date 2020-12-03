import { battleBase } from "utils/creep/battleBase";
import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";

/**
 * 士兵
 * 会一直向旗帜发起进攻,
 * 优先攻击旗帜 3*3 范围内的 creep, 没有的话会攻击旗帜所在位置的建筑
 */
export default function attacker(data: WarUnitData): ICreepConfig {
  return {
    ...battleBase(data.targetFlagName, data.keepSpawn),
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
    bodys: createBodyGetter(bodyConfigs.attacker)
  };
}
