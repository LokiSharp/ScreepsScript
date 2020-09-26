/**
 * 建筑者
 * 只有在有工地时才会生成
 * 从指定结构中获取能量 > 查找建筑工地并建造
 *
 */
export default (data: HarvesterData): ICreepConfig => ({
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
    let source: StructureStorage | StructureTerminal | StructureContainer | Source;
    if (!creep.memory.sourceId) {
      source = creep.room.getAvailableSource();
      creep.memory.sourceId = source.id;
    } else source = Game.getObjectById(creep.memory.sourceId as Id<Source>);

    // 之前用的能量来源没能量了就更新来源（如果来源已经是 source 的话就不改了）
    if (creep.getEngryFrom(source) === ERR_NOT_ENOUGH_RESOURCES && source instanceof Structure)
      delete creep.memory.sourceId;
    return false;
  },
  target: creep => {
    // 有新墙就先刷新墙
    if (creep.memory.fillWallId) creep.steadyWall();
    // 没有就建其他工地
    else if (creep.buildStructure() !== ERR_NOT_FOUND) {
      // PASS
    }
    // 工地也没了就去升级
    else if (creep.upgrade()) {
      // PASS
    }

    if (creep.store.getUsedCapacity() === 0) return true;
    else return false;
  },
  bodys: "worker"
});
