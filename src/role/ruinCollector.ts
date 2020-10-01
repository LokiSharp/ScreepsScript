/**
 * 废墟收集单位
 * 从废墟中获取资源运输至 storage
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (data: EmptyData): ICreepConfig => ({
  // 不存在有资源的废墟就使命完成
  isNeed: room => {
    const targets: string[] = room.memory.ruinIds;
    return targets.length > 0 ? true : false;
  },
  source: creep => {
    const ruinIds = creep.room.memory.ruinIds;

    if (creep.store.getUsedCapacity() > 0 || Object.keys(ruinIds).length === 0) return true;

    // 获取源 ruin
    const ruin: Ruin = Game.getObjectById<Ruin>(ruinIds[0] as Id<Ruin>);

    const resources = {};
    Object.values(RESOURCES_ALL).forEach(resourceType => {
      const resourceCapacity = ruin.store[resourceType];
      if (resourceCapacity !== null && resourceCapacity > 0) resources[resourceType] = resourceCapacity;
    });

    if (Object.keys(resources).length > 0) {
      Object.keys(resources).forEach(resourceType => {
        const result = creep.withdraw(ruin, resourceType as ResourceConstant);
        if (result === ERR_NOT_IN_RANGE) creep.goTo(ruin.pos);
      });
    }
    return false;
  },
  target: creep => {
    if (creep.store.getUsedCapacity() === 0) return true;
    const resources = {};
    Object.values(RESOURCES_ALL).forEach(resourceType => {
      const resourceCapacity = creep.store[resourceType];
      if (resourceCapacity !== null && resourceCapacity > 0) resources[resourceType] = resourceCapacity;
    });

    if (Object.keys(resources).length > 0) {
      Object.keys(resources).forEach(resourceType => {
        creep.transferTo(creep.room.storage, resourceType as ResourceConstant);
      });
    } else creep.say("💤");
    return true;
  },
  bodys: "manager"
});
