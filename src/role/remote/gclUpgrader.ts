import { TRANSFER_DEATH_LIMIT } from "@/setting";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import deathPrepare from "@/utils/creep/deathPrepare";
import { getRoomEnergyTarget } from "@/modules/energyController";

/**
 * 强化协助建造者
 * 协助其他房间进行建造工作，刷 RCL 用
 */
export const gclUpgrader: CreepConfig<"gclUpgrader"> = {
  source: creep => {
    if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep);
    const { targetRoomName, upgradePosInfo } = creep.memory.data;
    if (creep.room.name !== targetRoomName || creep.pos.x !== upgradePosInfo.x || creep.pos.y !== upgradePosInfo.y) {
      creep.goTo(Game.rooms[targetRoomName].controller.getUpgradePos(creep), { range: 0 });
      return creep.room.name === targetRoomName && creep.pos.x === upgradePosInfo.x && creep.pos.y === upgradePosInfo.y;
    } else if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      return true;
    }
    let source: AllEnergySource;
    source = ((creep.pos
      .findInRange(FIND_MY_STRUCTURES, 1)
      .filter(
        structure =>
          (structure.structureType === STRUCTURE_TERMINAL || structure.structureType === STRUCTURE_STORAGE) &&
          structure.store.getUsedCapacity(RESOURCE_ENERGY) >= 10000
      ) as unknown) as (StructureTerminal | StructureStorage)[]).reduce(
      (a, b) => (a?.store.getUsedCapacity(RESOURCE_ENERGY) > b?.store.getUsedCapacity(RESOURCE_ENERGY) ? a : b),
      undefined
    );
    if (source) {
      creep.getEnergyFrom(source);
      return true;
    }

    const nearByEnergyCreep: Creep = creep.pos.findInRange(FIND_MY_CREEPS, 1).find(targetCreep => {
      return targetCreep.store?.getUsedCapacity(RESOURCE_ENERGY) > 100;
    });

    if (nearByEnergyCreep) return false;

    // 获取有效的能量来源
    if (
      creep.room.name === creep.memory.data.spawnRoom ||
      Game.rooms[creep.memory.data.targetRoomName].storage.store.getUsedCapacity(RESOURCE_ENERGY) +
        Game.rooms[creep.memory.data.targetRoomName].terminal.store.getUsedCapacity(RESOURCE_ENERGY) <
        10000
    ) {
      if (!creep.memory.sourceId) {
        source = source = getRoomEnergyTarget(creep.room);
        if (!source) {
          creep.say("没能量了，歇会");
          return false;
        }

        creep.memory.sourceId = source.id;
      } else source = Game.getObjectById(creep.memory.sourceId);
      // 之前的来源建筑里能量不够了就更新来源
      if (
        !source ||
        (source instanceof Structure && source.store[RESOURCE_ENERGY] < 10000) ||
        (source instanceof Source && source.energy === 0) ||
        (source instanceof Ruin && source.store[RESOURCE_ENERGY] === 0) ||
        source.room.name === creep.memory.data.spawnRoom
      )
        delete creep.memory.sourceId;

      creep.getEnergyFrom(source);
    }
    return false;
  },
  target: creep => {
    const { targetRoomName } = creep.memory.data;
    if (
      creep.room.name !== targetRoomName ||
      creep.pos.x !== creep.memory.data.upgradePosInfo.x ||
      creep.pos.y !== creep.memory.data.upgradePosInfo.y
    )
      return true;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      const nearByMinEnergyCreep: Creep = creep.pos
        .findInRange(FIND_MY_CREEPS, 1)
        .filter((targetCreep: Creep<"gclUpgrader">) => {
          return (
            targetCreep.name !== creep.name &&
            targetCreep.memory.role === "gclUpgrader" &&
            targetCreep.ticksToLive >= 30 &&
            targetCreep.memory.data.upgradePosInfo &&
            creep.memory.data.upgradePosInfo &&
            Math.min(
              targetCreep.memory.data.upgradePosInfo.rangeToStorage,
              targetCreep.memory.data.upgradePosInfo.rangeToTerminal
            ) >
              Math.min(
                creep.memory.data.upgradePosInfo.rangeToStorage,
                creep.memory.data.upgradePosInfo.rangeToTerminal
              ) &&
            targetCreep.store?.getUsedCapacity(RESOURCE_ENERGY) <= 100
          );
        })
        .reduce(
          (a, b) => (a?.store.getUsedCapacity(RESOURCE_ENERGY) < b?.store.getUsedCapacity(RESOURCE_ENERGY) ? a : b),
          undefined
        );
      if (nearByMinEnergyCreep) {
        creep.transfer(
          nearByMinEnergyCreep,
          RESOURCE_ENERGY,
          Math.min(creep.store.getUsedCapacity(RESOURCE_ENERGY), nearByMinEnergyCreep.store.getFreeCapacity())
        );
        return true;
      }
    }

    // 检查脚下的路有没有问题，有的话就进行维修
    const structures = creep.pos.lookFor(LOOK_STRUCTURES);

    if (structures.length > 0) {
      const road = structures[0];
      if (road.hits < road.hitsMax) creep.repair(road);
    }

    creep.upgradeRoom(targetRoomName);
    return creep.store.getUsedCapacity() === 0;
  },
  bodys: () => calcBodyPart({ [WORK]: 26, [CARRY]: 11, [MOVE]: 13 })
};
