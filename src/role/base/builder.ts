import { bodyConfigs } from "setting";
import createBodyGetter from "utils/createBodyGetter";

/**
 * 建筑者
 * 只有在有工地时才会生成
 * 从指定结构中获取能量 > 查找建筑工地并建造
 *
 */
export default function builder(data: HarvesterData): ICreepConfig {
  return {
    // 工地都建完就就使命完成
    isNeed: room => {
      const targets: ConstructionSite[] = room.find(FIND_MY_CONSTRUCTION_SITES);
      return targets.length > 0 ? true : false;
    },
    // 把 data 里的 sourceId 挪到外边方便修改
    prepare: creep => {
      creep.memory.sourceId = data.sourceId;
      return true;
    },
    // 根据 sourceId 对应的能量来源里的剩余能量来自动选择新的能量来源
    source: creep => {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

      // 获取有效的能量来源
      let source: AllEnergySource;
      if (!creep.memory.sourceId) {
        source = creep.room.getAvailableSource();
        if (!source) {
          creep.say("没能量了，歇会");
          return false;
        }

        creep.memory.sourceId = source.id;
      } else source = Game.getObjectById(creep.memory.sourceId);

      // 之前用的能量来源没能量了就更新来源（如果来源已经是 source 的话就不改了）
      const result = creep.getEngryFrom(source);
      if (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_INVALID_TARGET) delete creep.memory.sourceId;
      return false;
    },
    target: creep => {
      // 有新墙就先刷新墙
      if (creep.memory.fillWallId) creep.steadyWall();
      // 执行建造之后检查下是不是都造好了，如果是的话这辈子就不会再建造了，等下辈子出生后再检查（因为一千多 tick 基本上不会出现新的工地）
      else if (creep.memory.dontBuild) creep.upgrade();
      // 没有就建其他工地
      else if (creep.buildStructure() === ERR_NOT_FOUND) {
        // 如果延迟建造队列不为空，触发建筑规划
        if (creep.room.memory.delayCSList && creep.room.memory.delayCSList.length > 0) {
          creep.room.planLayout();
        } else {
          creep.memory.dontBuild = true;
        }
      }
      if (creep.store.getUsedCapacity() === 0) return true;
      else return false;
    },
    bodys: createBodyGetter(bodyConfigs.worker)
  };
}
