import { TRANSFER_DEATH_LIMIT, bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";
import deathPrepare from "utils/creep/deathPrepare";
import { getRoomTransferTask } from "utils/creep/getRoomTransferTask";
import { transferTaskOperations } from "utils/creep/transferTaskOperations";

/**
 * 房间物流运输者
 * 执行 ROOM_TRANSFER_TASK 中定义的任务
 * 任务处理逻辑定义在 transferTaskOperations 中
 */
export default function manager(data: WorkerData): ICreepConfig {
  return {
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
    bodys: createBodyGetter(bodyConfigs.transporter)
  };
}
