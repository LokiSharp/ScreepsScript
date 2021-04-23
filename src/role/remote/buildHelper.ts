import { getClosestTo, getEnergyAmount } from "@/modules/energyController/findStrategy";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import { getRoomEnergyTarget } from "@/modules/energyController";

/**
 * 协助建造者
 * 协助其他玩家进行建造工作
 */
export const buildHelper: CreepConfig<"buildHelper"> = {
  // 下面是正常的建造者逻辑
  source: creep => {
    const { spawnRoom, targetRoomName } = creep.memory.data;
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      if (creep.room.name !== targetRoomName) {
        creep.goTo(new RoomPosition(25, 25, targetRoomName), { checkTarget: false });
        return false;
      } else {
        creep.goTo(new RoomPosition(25, 25, targetRoomName), { checkTarget: false });
        delete creep.memory.moveInfo;
        return true;
      }
    }

    // 获取有效的能量来源
    let source: AllEnergySource = getRoomEnergyTarget(Game.rooms[targetRoomName], getClosestTo(creep.pos), targets =>
      targets.filter(target => getEnergyAmount(target) > 10000)
    );
    if (!source) source = getRoomEnergyTarget(Game.rooms[spawnRoom]);
    if (!source) {
      creep.say("没能量了，歇会");
      return false;
    }

    creep.memory.sourceId = source.id;

    creep.getEngryFrom(source);
    return false;
  },
  target: creep => {
    const { targetRoomName } = creep.memory.data;
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0 || creep.room.name !== targetRoomName) return true;

    // 检查脚下的路有没有问题，有的话就进行维修
    const structures = creep.pos.lookFor(LOOK_STRUCTURES);

    if (structures.length > 0) {
      const road = structures[0];
      if (road.hits < road.hitsMax) creep.repair(road);
    }

    if (creep.memory.fillWallId)
      // 有新墙就先刷新墙
      creep.steadyWall();
    // 执行建造之后检查下是不是都造好了，如果是的话这辈子就不会再建造了，等下辈子出生后再检查（因为一千多 tick 基本上不会出现新的工地）
    else if (creep.memory.dontBuild) creep.upgradeRoom(targetRoomName);
    // 没有就建其他工地
    else if (creep.buildStructure() === ERR_NOT_FOUND) creep.memory.dontBuild = true;

    return creep.store.getUsedCapacity() === 0;
  },
  bodys: () => calcBodyPart({ [WORK]: 16, [CARRY]: 16, [MOVE]: 16 })
};
