/**
 * 升级者
 * 不会采集能量，只会从指定目标获取能量
 * 从指定建筑中获取能量 > 升级 controller
 */
export default (data: HarvesterData): ICreepConfig => ({
  source: creep => {
    // 因为只会从建筑里拿，所以只要拿到了就去升级
    if (creep.store[RESOURCE_ENERGY] > 0) return true;

    const source: StructureTerminal | StructureStorage | StructureContainer = Game.getObjectById(
      data.sourceId as Id<StructureTerminal | StructureStorage | StructureContainer>
    );

    // 如果来源是 container 的话就等到其中能量大于指定数量再拿（优先满足 filler 的能量需求）
    if (source && source.structureType === STRUCTURE_CONTAINER && source.store[RESOURCE_ENERGY] <= 500) return false;

    // 获取能量
    const result = creep.getEngryFrom(source);
    // 但如果是 Container 或者 Link 里获取能量的话，就不会重新运行规划
    if (
      (result === ERR_NOT_ENOUGH_RESOURCES || result === ERR_INVALID_TARGET) &&
      (source instanceof StructureTerminal || source instanceof StructureStorage)
    ) {
      // 如果发现能量来源（建筑）里没有能量了，就自杀并重新运行 upgrader 发布规划
      creep.room.releaseCreep("upgrader");
      creep.suicide();
    }
    return false;
  },
  target: creep => {
    if (creep.upgrade() === ERR_NOT_ENOUGH_RESOURCES) return true;
    else return false;
  },
  bodys: "upgrader"
});
