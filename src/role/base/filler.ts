import { TRANSFER_DEATH_LIMIT, bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";
import deathPrepare from "utils/creep/deathPrepare";

/**
 * 填充单位
 * 从 container 中获取能量 > 执行房间物流任务
 * 在空闲时间会尝试把能量运输至 storage
 */
export const filler: CreepConfig<"filler"> = {
  source: creep => {
    const { sourceId, workRoom } = creep.memory.data;
    if (creep.ticksToLive <= TRANSFER_DEATH_LIMIT) return deathPrepare(creep, sourceId);

    return Game.rooms[workRoom]?.transport.getWork(creep).source();
  },
  target: creep => {
    const { workRoom } = creep.memory.data;
    return Game.rooms[workRoom]?.transport.getWork(creep).target();
  },
  bodys: createBodyGetter(bodyConfigs.transporter)
};
