import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";
import remoteHelperIsNeed from "@/utils/creep/remoteHelperIsNeed";

/**
 * 支援建造者
 * 拓展型建造者, 会先抵达指定房间, 然后执行建造者逻辑
 * 如果都造好的话就升级控制器
 */
export const remoteBuilder: CreepConfig<"remoteBuilder"> = {
  isNeed: (room, preMemory) => {
    const { targetRoomName } = preMemory.data;
    const target = Game.rooms[targetRoomName];
    // 如果房间造好了 terminal，自己的使命就完成了
    return remoteHelperIsNeed(room, target, () => target.terminal && target.terminal.my);
  },
  ...inPlaceBase(),
  source: creep => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      const { targetRoomName } = creep.memory.data;
      creep.goTo(new RoomPosition(25, 25, targetRoomName), { checkTarget: false });
      // 只要进入房间则准备结束
      if (creep.room.name !== targetRoomName) return false;
      else {
        delete creep.memory.moveInfo;
        return true;
      }
    }

    const source = Game.getObjectById(creep.memory.data.sourceId);

    creep.getEnergyFrom(source);
    return false;
  },
  target: creep => {
    const { targetRoomName } = creep.memory.data;
    // 有新墙就先刷新墙
    if (creep.memory.fillWallId) creep.steadyWall();
    // 执行建造之后检查下是不是都造好了，如果是的话这辈子就不会再建造了，等下辈子出生后再检查（因为一千多 tick 基本上不会出现新的工地）
    else if (creep.memory.dontBuild) creep.upgradeRoom(targetRoomName);
    // 没有就建其他工地
    else if (creep.buildStructure() === ERR_NOT_FOUND) creep.memory.dontBuild = true;

    return creep.store.getUsedCapacity() === 0;
  },
  bodys: createBodyGetter(bodyConfigs.worker)
};
