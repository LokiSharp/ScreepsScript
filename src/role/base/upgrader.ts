import { bodyConfigs } from "@/setting";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import createBodyGetter from "@/utils/creep/createBodyGetter";

/**
 * 升级者
 * 不会采集能量，只会从指定目标获取能量
 * 从指定建筑中获取能量 > 升级 controller
 */
export const upgrader: CreepConfig<"upgrader"> = {
  source: creep => {
    const { sourceId } = creep.memory.data;
    // 因为只会从建筑里拿，所以只要拿到了就去升级
    if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) return true;

    const source = Game.getObjectById(sourceId);

    // 如果能量来源是 container
    if (source && source.structureType === STRUCTURE_CONTAINER) {
      // 完全没能量很少见，可能是边上有 link 了（这时候 harvester 会把能量存到 link 里，就不再用 container 了）
      // 所以这里需要特殊判断一下，避免 upgrader 对着一个空的 container 发呆好几辈子
      if (source.store[RESOURCE_ENERGY] === 0) {
        const nearLinks = source.pos.findInRange(FIND_MY_STRUCTURES, 1, {
          filter: s => s.structureType === STRUCTURE_LINK
        });
        // 已经造好 link 了，废弃空 container
        if (nearLinks.length > 0) {
          source.destroy();
          return false;
        }
      }
      // 有能量但是太少，就等到其中能量大于指定数量再拿（优先满足 manager 的能量需求）
      else if (source.store[RESOURCE_ENERGY] <= 500) {
        creep.say("🎲");
        return false;
      }
    }
    // 获取能量
    const result = creep.getEngryFrom(source);

    // 但如果是 Container 或者 Link 里获取能量的话，就不会重新运行规划
    if (
      (result === ERR_NOT_ENOUGH_RESOURCES &&
        (source instanceof StructureTerminal || source instanceof StructureStorage)) ||
      result === ERR_INVALID_TARGET
    ) {
      // 如果发现能量来源（建筑）里没有能量了，就自杀并重新运行 upgrader 发布规划
      creep.room.releaseCreep("upgrader");
      creep.suicide();
    }
    return false;
  },
  target: creep => {
    return creep.upgrade() === ERR_NOT_ENOUGH_RESOURCES;
  },
  bodys: (room, spawn) => {
    // 7 级和 8 级时要孵化指定尺寸的 body
    if (room.controller && room.controller.my) {
      if (room.controller.level === 7 && room.memory.upgradeLinkId)
        return calcBodyPart({ [WORK]: 20, [CARRY]: 4, [MOVE]: 10 });
      else if (room.controller.level === 8) return calcBodyPart({ [WORK]: 15, [CARRY]: 15, [MOVE]: 15 });
    }

    return createBodyGetter(bodyConfigs.worker)(room, spawn);
  }
};
