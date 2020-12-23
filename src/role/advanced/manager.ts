import { TRANSFER_DEATH_LIMIT, bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";
import deathPrepare from "utils/creep/deathPrepare";

/**
 * 房间物流运输者
 * 执行 ROOM_TRANSFER_TASK 中定义的任务
 * 任务处理逻辑定义在 transferTaskOperations 中
 */
export const manager: CreepConfig<"manager"> = {
  source: creep => {
    const { workRoom } = creep.memory.data;
    if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep);

    return Game.rooms[workRoom]?.transport.getWork(creep).source();
  },
  target: creep => {
    const { workRoom } = creep.memory.data;
    return Game.rooms[workRoom]?.transport.getWork(creep).target();
  },
  bodys: createBodyGetter(bodyConfigs.transporter)
};
