import { bodyConfigs } from "@/setting";
import createBodyGetter from "@/utils/creep/createBodyGetter";

/**
 * 收集者
 * 从指定 source 中获取资源 > 将资源转移到指定建筑中
 */
export const collector: CreepConfig<"collector"> = {
  prepare: creep => {
    const { sourceId } = creep.memory.data;
    // 已经到附近了就准备完成
    if (creep.pos.isNearTo(Game.getObjectById(sourceId).pos)) return true;
    // 否则就继续移动
    else {
      creep.goTo(Game.getObjectById(sourceId).pos);
      return false;
    }
  },
  source: creep => {
    const { sourceId } = creep.memory.data;
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

    const source = Game.getObjectById(sourceId);
    if (!source) {
      creep.say("目标找不到!");
      return false;
    }

    const result = creep.harvest(source);

    if (result === ERR_NOT_IN_RANGE) creep.goTo(source.pos);

    // 快死了就把能量移出去
    return creep.ticksToLive <= 3;
  },
  target: creep => {
    const { targetId } = creep.memory.data;
    const target: Structure = Game.getObjectById(targetId);
    // 找不到目标了，自杀并重新运行发布规划
    if (!target) {
      creep.say("目标找不到!");
      creep.room.releaseCreep("harvester");
      creep.suicide();
      return false;
    }

    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.goTo(target.pos);

    return creep.store.getUsedCapacity() === 0;
  },
  bodys: createBodyGetter(bodyConfigs.worker)
};
