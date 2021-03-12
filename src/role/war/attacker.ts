import { battleBase } from "@/utils/creep/battleBase";
import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 士兵
 * 会一直向旗帜发起进攻,
 * 优先攻击旗帜 3*3 范围内的 creep, 没有的话会攻击旗帜所在位置的建筑
 */
export const attacker: CreepConfig<"attacker"> = {
  ...battleBase(),
  ...inPlaceBase(),
  target: creep => {
    const { targetFlagName } = creep.memory.data;
    creep.attackFlag(targetFlagName);

    const targetFlag = creep.getFlag(targetFlagName);
    if (!targetFlag) {
      creep.say("旗呢?");
      return false;
    }
    if (creep.room.name !== targetFlag.pos.roomName) return true;
    else {
      creep.goTo(targetFlag.pos, {
        checkTarget: true
      });
      return false;
    }
  },
  bodys: createBodyGetter(bodyConfigs.attacker)
};
