import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 医生
 * 一直治疗给定的 creep
 */
export const healer: CreepConfig<"healer"> = {
  isNeed: (room, preMemory) => preMemory.data.keepSpawn,
  prepare: creep => {
    const { wayPoint } = creep.memory.data;
    // 治疗单位不允许发起对穿
    creep.memory.disableCross = true;
    if (wayPoint) {
      creep.setWayPoint(wayPoint);
      creep.memory.fromShard = Game.shard.name as ShardName;
    }
    return true;
  },
  ...inPlaceBase(),
  source: creep => {
    const { creepName } = creep.memory.data;
    if (creep.memory.moveInfo && creep.memory.moveInfo.wayPoints) {
      creep.goTo(undefined, {
        checkTarget: true,
        range: 0
      });
    }

    if (creepName in Game.creeps) {
      const target = Game.creeps[creepName];

      if (target?.memory?.moveInfo?.wayPoints && target.memory.moveInfo.wayPoints.length > 1) {
        // PASS
      } else {
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
      const target = Game.creeps[creep.memory.data.creepName];
      if (!target) {
        creep.say("💤");
      }
      creep.healTo(target);
    }
    return false;
  },
  bodys: createBodyGetter(bodyConfigs.healer)
};
