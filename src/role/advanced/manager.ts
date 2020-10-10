import { getRoomTransferTask, transferTaskOperations } from "../../utils/roomTransferTask";
import { TRANSFER_DEATH_LIMIT } from "setting";
import { deathPrepare } from "../../utils/deathPrepare";

/**
 * 填充单位
 * 从 container 中获取能量 > 执行房间物流任务
 * 在空闲时间会尝试把能量运输至 storage
 */
export default (data: WorkerData): ICreepConfig => ({
  source: creep => {
    if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, data.sourceId);

    const task = getRoomTransferTask(creep.room);

    // 有任务就执行
    if (task) return transferTaskOperations[task.type].source(creep, task, data.sourceId);
    else {
      creep.say("💤");
      return false;
    }
  },
  target: creep => {
    const task = getRoomTransferTask(creep.room);

    // 有任务就执行
    if (task) return transferTaskOperations[task.type].target(creep, task);
    else return true;
  },
  bodys: "manager"
});
