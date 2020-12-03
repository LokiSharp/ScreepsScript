import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";

/**
 * 医生
 * 一直治疗给定的 creep
 */
export default function healer(data: HealUnitData): ICreepConfig {
  return {
    isNeed: () => data.keepSpawn,
    prepare: creep => {
      // 治疗单位不允许发起对穿
      creep.memory.disableCross = true;
      if ((creep.memory.data as RangedAttackerData).wayPoint) {
        creep.setWayPoint((creep.memory.data as RangedAttackerData).wayPoint);
        creep.memory.fromShard = Game.shard.name as ShardName;
      }
      return true;
    },
    source: (creep: Creep) => {
      if (creep.memory.moveInfo && creep.memory.moveInfo.wayPoints) {
        creep.goTo(undefined, {
          checkTarget: true,
          range: 0
        });
      }

      if (data.creepName in Game.creeps) {
        const target = Game.creeps[data.creepName];

        if (
          target &&
          target.memory &&
          target.memory.moveInfo &&
          (!target.memory.moveInfo.wayPoints || target.memory.moveInfo.wayPoints.length <= 1)
        ) {
          creep.log(`抵达指定房间，切入作战模式`, "green");
          return true;
        }
      }

      return false;
    },
    target: creep => {
      if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL)) {
        creep.heal(creep);
        creep.say("💔", true);
      } else {
        const target = Game.creeps[data.creepName];
        if (!target) {
          creep.say("💤");
        }
        creep.healTo(target);
      }
      return false;
    },
    bodys: createBodyGetter(bodyConfigs.healer)
  };
}
