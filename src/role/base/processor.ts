import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";

/**
 * 中心搬运者
 * 从房间的中央任务队列 Room.memory.centerTransferTasks 中取出任务并执行
 */
export const processor: CreepConfig<"processor"> = {
  // 移动到指定位置
  prepare: creep => {
    const { x, y } = creep.memory.data;

    if (creep.pos.isEqualTo(x, y)) return true;
    else {
      creep.goTo(new RoomPosition(x, y, creep.room.name), { range: 0 });
      return false;
    }
  },
  // 从中央任务队列中取出任务并执行
  source: creep => {
    // 快死了就拒绝执行任务
    if (creep.ticksToLive <= 5) return false;
    // 获取任务
    const task = creep.room.centerTransport.getTask();
    if (!task) return false;

    // 通过房间基础服务获取对应的建筑
    const structure = creep.room[task.source];
    if (!structure) {
      creep.room.centerTransport.deleteCurrentTask();
      return false;
    }

    // 获取取出数量
    let withdrawAmount = creep.store.getFreeCapacity();
    if (withdrawAmount > task.amount) withdrawAmount = task.amount;
    // 尝试取出资源
    const result = creep.withdraw(structure, task.resourceType, withdrawAmount);
    if (result === OK) return true;
    // 资源不足就移除任务
    else if (result === ERR_NOT_ENOUGH_RESOURCES) creep.room.centerTransport.deleteCurrentTask();
    // 够不到就移动过去
    else if (result === ERR_NOT_IN_RANGE) creep.goTo(structure.pos, { range: 1 });
    else if (result === ERR_FULL) return true;
    else {
      creep.log(`source 阶段取出异常，错误码 ${result}`, "red");
      creep.room.centerTransport.hangTask();
    }

    return false;
  },
  // 将资源移动到指定建筑
  target: creep => {
    // 没有任务就返回 source 阶段待命
    const task = creep.room.centerTransport.getTask();
    if (!task) return true;

    // 提前获取携带量
    const amount: number = creep.store.getUsedCapacity(task.resourceType);

    // 通过房间基础服务获取对应的建筑
    const structure = creep.room[task.target];
    if (!structure) {
      creep.room.centerTransport.deleteCurrentTask();
      return false;
    }

    const result = creep.transferTo(structure, task.resourceType, { range: 1 });

    // 如果转移完成则增加任务进度
    if (result === OK) {
      creep.room.centerTransport.handleTask(amount);
      return true;
    } else if (result === ERR_FULL) {
      creep.log(`${task.target} 满了`);
      if (task.target === STRUCTURE_TERMINAL) Game.notify(`[${creep.room.name}] ${task.target} 满了，请尽快处理`);
      creep.room.centerTransport.hangTask();
    }
    // 资源不足就返回 source 阶段
    else if (result === ERR_NOT_ENOUGH_RESOURCES) {
      creep.say(`取出资源`);
      return true;
    } else {
      creep.say(`存入 ${result}`);
      creep.room.centerTransport.hangTask();
    }

    return false;
  },
  bodys: createBodyGetter(bodyConfigs.processor)
};
