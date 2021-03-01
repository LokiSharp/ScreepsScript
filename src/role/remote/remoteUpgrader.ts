import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { getRoomAvailableSource } from "@/modules/energyController/energyController";
import remoteHelperIsNeed from "@/utils/creep/remoteHelperIsNeed";

/**
 * 支援升级者
 * 拓展型升级者, 会先抵达指定房间, 然后执行升级者逻辑
 */
export const remoteUpgrader: CreepConfig<"remoteUpgrader"> = {
  isNeed: (room, preMemory) => {
    const { targetRoomName } = preMemory.data;
    const target = Game.rooms[targetRoomName];
    // 目标房间到 6 了就算任务完成
    return remoteHelperIsNeed(room, target, () => target.controller.level >= 6);
  },
  // 向指定房间移动
  prepare: creep => {
    const { wayPoint, targetRoomName } = creep.memory.data;
    // 设定路径点
    if (wayPoint && !creep.memory.fromShard) {
      creep.setWayPoint(wayPoint);
      creep.memory.fromShard = Game.shard.name as ShardName;
    }

    // 只要进入房间则准备结束
    if (creep.room.name !== targetRoomName) {
      if (wayPoint && creep.memory.fromShard) {
        creep.goTo(undefined, {
          checkTarget: true,
          range: 0
        });
      } else {
        creep.goTo(new RoomPosition(25, 25, targetRoomName));
      }

      return false;
    } else {
      delete creep.memory.moveInfo;
      return true;
    }
  },
  // 下面是正常的升级者逻辑
  source: creep => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

    // 获取有效的能量来源
    let source: AllEnergySource;
    if (!creep.memory.sourceId) {
      source = getRoomAvailableSource(creep.room);
      if (!source) {
        creep.say("没能量了，歇会");
        return false;
      }

      creep.memory.sourceId = source.id;
    } else source = Game.getObjectById(creep.memory.sourceId);
    // 之前的来源建筑里能量不够了就更新来源
    if (
      !source ||
      (source instanceof Structure && source.store[RESOURCE_ENERGY] < 300) ||
      (source instanceof Source && source.energy === 0) ||
      (source instanceof Ruin && source.store[RESOURCE_ENERGY] === 0)
    )
      delete creep.memory.sourceId;

    creep.getEngryFrom(source);
    return false;
  },
  target: creep => {
    creep.upgrade();
    return creep.store.getUsedCapacity() === 0;
  },
  bodys: createBodyGetter(bodyConfigs.remoteHelper)
};
