import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";
import remoteHelperIsNeed from "@/utils/creep/remoteHelperIsNeed";

/**
 * 支援升级者
 * 拓展型升级者, 会先抵达指定房间, 然后执行升级者逻辑
 */
export const remoteUpgrader: CreepConfig<"remoteUpgrader"> = {
  isNeed: (room, preMemory) => {
    const target = Game.rooms[preMemory.data.targetRoomName];
    // 目标房间到 6 了就算任务完成
    return remoteHelperIsNeed(room, target, () => target.controller.level >= 6);
  },
  ...inPlaceBase(),
  // 向指定房间移动
  prepare: creep => {
    const { targetRoomName } = creep.memory.data;
    creep.goTo(new RoomPosition(25, 25, targetRoomName), { checkTarget: false });
    // 只要进入房间则准备结束
    if (creep.room.name !== targetRoomName) return false;
    else {
      delete creep.memory.moveInfo;
      return true;
    }
  },
  // 下面是正常的升级者逻辑
  source: creep => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

    const source = Game.getObjectById(creep.memory.data.sourceId);

    creep.getEngryFrom(source);
    return false;
  },
  target: creep => {
    const { targetRoomName } = creep.memory.data;
    creep.upgradeRoom(targetRoomName);
    return creep.store.getUsedCapacity() === 0;
  },
  bodys: createBodyGetter(bodyConfigs.worker)
};
