import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";

/**
 * 收集者
 * 从指定 source 中获取资源 > 将资源转移到指定建筑中
 */
export default function collector(data: HarvesterData): ICreepConfig {
  return {
    prepare: creep => {
      // 已经到附近了就准备完成
      if (creep.pos.isNearTo(Game.getObjectById(data.sourceId).pos)) return true;
      // 否则就继续移动
      else {
        creep.goTo(Game.getObjectById(data.sourceId).pos);
        return false;
      }
    },
    source: creep => {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

      const source = Game.getObjectById(data.sourceId);
      if (!source) {
        creep.say("目标找不到!");
        return false;
      }

      const result = creep.harvest(source);

      if (result === ERR_NOT_IN_RANGE) creep.goTo(source.pos);

      // 快死了就把能量移出去
      if (creep.ticksToLive <= 3) return true;
      return false;
    },
    target: creep => {
      const target: Structure = Game.getObjectById(data.targetId);
      // 找不到目标了，自杀并重新运行发布规划
      if (!target) {
        creep.say("目标找不到!");
        creep.room.releaseCreep("harvester");
        creep.suicide();
        return false;
      }

      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) creep.goTo(target.pos);

      if (creep.store.getUsedCapacity() === 0) return true;
      return false;
    },
    bodys: createBodyGetter(bodyConfigs.worker)
  };
}
