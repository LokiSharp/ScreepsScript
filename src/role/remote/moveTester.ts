import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 移动测试单位
 *
 * 一直朝着旗帜移动
 * 添加：creepApi.add('happyCreep0', 'moveTester', { wayPoint: 'p' }, 'W49S9')
 * 删除：creepApi.remove('happyCreep')
 */
export const moveTester: CreepConfig<"moveTester"> = {
  isNeed: (room, preMemory) => preMemory.data.keepSpawn,
  ...inPlaceBase(),
  wayPoint: creep => {
    const { wayPoint, logPrePos } = creep.memory.data;
    if (wayPoint) creep.setWayPoint(creep.memory.data.wayPoint);
    if (logPrePos) creep.memory.logPrePos = logPrePos;
    return true;
  },
  target: creep => {
    const result = creep.goTo(undefined, {
      checkTarget: true,
      range: 0
    });
    if (creep.memory.moveInfo) {
      const moveInfo = creep.memory.moveInfo;
      const path = moveInfo ? moveInfo.path || "" : "";
      creep.say(`${result.toString()} ${path}`);
    }

    return false;
  },
  bodys: () => [MOVE]
};
