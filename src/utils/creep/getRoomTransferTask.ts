import { transferTaskOperations } from "./transferTaskOperations";

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
