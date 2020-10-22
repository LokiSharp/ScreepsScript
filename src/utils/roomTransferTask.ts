import { ROOM_TRANSFER_TASK } from "setting";

/**
 * manager 在应对不同类型的任务时执行的操作
 * 该对象的属性名即为任务类型
 */
export const transferTaskOperations: { [taskType: string]: transferTaskOperation } = {
  /**
   * extension 填充任务
   * 维持正常孵化的任务
   */
  [ROOM_TRANSFER_TASK.FILL_EXTENSION]: {
    source: (creep: Creep, task: IFillExtension, sourceId: string): boolean => {
      if (creep.store[RESOURCE_ENERGY] > 0) return true;
      const result = creep.getEngryFrom(sourceId ? Game.getObjectById(sourceId as Id<Source>) : creep.room.storage);
      return result === OK;
    },
    target: (creep: Creep): boolean => {
      if (creep.store[RESOURCE_ENERGY] === 0) return true;
      let target: StructureExtension;

      // 有缓存就用缓存
      if (creep.memory.fillStructureId) {
        target = Game.getObjectById(creep.memory.fillStructureId as Id<StructureExtension>);

        // 如果找不到对应的建筑或者已经填满了就移除缓存
        if (
          !target ||
          target.structureType !== STRUCTURE_EXTENSION ||
          target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
        ) {
          delete creep.memory.fillStructureId;
          target = undefined;
        }
      }

      // 没缓存就重新获取
      if (!target) {
        // 获取有需求的建筑
        target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
          // extension 中的能量没填满
          filter: s =>
            (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) &&
            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        }) as StructureExtension;
        if (!target) {
          // 都填满了，任务完成
          creep.room.deleteCurrentRoomTransferTask();
          return true;
        }

        // 写入缓存
        creep.memory.fillStructureId = target.id;
      }

      // 有的话就填充能量
      creep.goTo(target.pos);
      const result = creep.transfer(target, RESOURCE_ENERGY);
      if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_FULL) return true;
      else if (result !== OK && result !== ERR_NOT_IN_RANGE) creep.say(`拓展填充 ${result}`);
      return false;
    }
  },

  /**
   * tower 填充任务
   * 维持房间内所有 tower 的能量
   */
  [ROOM_TRANSFER_TASK.FILL_TOWER]: {
    source: (creep: Creep, task: IFillExtension, sourceId: string): boolean => {
      if (creep.store[RESOURCE_ENERGY] > 0) return true;
      const result = creep.getEngryFrom(
        sourceId ? Game.getObjectById(sourceId as Id<Structure | Source>) : creep.room.storage
      );
      return result === OK;
    },
    target: (creep: Creep, task: IFillTower): boolean => {
      if (creep.store[RESOURCE_ENERGY] === 0) return true;
      let target: StructureTower;

      // 有缓存的话
      if (creep.memory.fillStructureId) {
        target = Game.getObjectById(creep.memory.fillStructureId as Id<StructureTower>);

        // 如果找不到对应的建筑或者已经填到 900 了就移除缓存
        if (!target || target.structureType !== STRUCTURE_TOWER || target.store[RESOURCE_ENERGY] > 900) {
          delete creep.memory.fillStructureId;
          target = undefined;
        }
      }

      // 有缓存的话
      if (!target) {
        // 先检查下任务发布 tower 能量是否足够
        target = Game.getObjectById(task.id as Id<StructureTower>);
        if (!target || target.store[RESOURCE_ENERGY] > 900) {
          // 然后再检查下还有没有其他 tower 没填充
          const towers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: s => s.structureType === STRUCTURE_TOWER && s.store[RESOURCE_ENERGY] <= 900
          });
          // 如果还没找到的话就算完成任务了
          if (towers.length <= 0) {
            creep.room.deleteCurrentRoomTransferTask();
            return true;
          }
          target = creep.pos.findClosestByRange(towers) as StructureTower;
        }

        // 写入缓存
        creep.memory.fillStructureId = target.id;
      }

      // 有的话就填充能量
      creep.goTo(target.pos);
      const result = creep.transfer(target, RESOURCE_ENERGY);
      if (result !== OK && result !== ERR_NOT_IN_RANGE) creep.say(`塔填充 ${result}`);
      return false;
    }
  }
};

/**
 * 获取指定房间的物流任务
 *
 * @param room 要获取物流任务的房间名
 */
export const getRoomTransferTask = function (room: Room): RoomTransferTasks | null {
  const task = room.getRoomTransferTask();
  if (!task) return null;

  // 如果任务类型不对就移除任务并报错退出
  if (!Object.prototype.hasOwnProperty.call(transferTaskOperations, task.type)) {
    room.deleteCurrentRoomTransferTask();
    room.log(`发现未定义的房间物流任务 ${task.type}, 已移除`, "manager", "yellow");
    return null;
  }

  return task;
};
