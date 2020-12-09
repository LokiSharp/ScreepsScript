import { battleBase } from "utils/creep/battleBase";
import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";

/**
 * 拆除者
 * 会一直向旗帜发起进攻，拆除旗帜下的建筑
 */
export const dismantler: CreepConfig<"dismantler"> = {
  ...battleBase(),
  prepare: creep => {
    const { wayPoint } = creep.memory.data;
    if (wayPoint) {
      creep.setWayPoint(wayPoint);
      creep.memory.fromShard = Game.shard.name as ShardName;
    }
    return true;
  },
  target: creep => {
    const { targetFlagName, healerName } = creep.memory.data;
    return creep.dismantleFlag(targetFlagName, healerName);
  },
  bodys: createBodyGetter(bodyConfigs.dismantler)
};
