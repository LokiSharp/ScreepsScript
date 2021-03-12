import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 斥候单位单位
 *
 * 一直朝着旗帜移动
 */
export const scout: CreepConfig<"scout"> = {
  isNeed: (room, preMemory) => preMemory.data.keepSpawn,
  ...inPlaceBase(),
  wayPoint: creep => {
    const { wayPoint } = creep.memory.data;
    if (wayPoint) creep.setWayPoint(creep.memory.data.wayPoint);
    return true;
  },
  target: creep => {
    const { targetFlagName } = creep.memory.data;
    const targetFlag = creep.getFlag(targetFlagName);
    creep.goTo(targetFlag.pos, {
      checkTarget: true,
      range: 0
    });

    return false;
  },
  bodys: () => [MOVE]
};
