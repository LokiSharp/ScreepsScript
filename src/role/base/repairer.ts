/**
 * 维修者
 * 从指定结构中获取能量 > 维修房间内的建筑
 * 注：目前维修者只会在敌人攻城时使用
 *
 */
export default (data: WorkerData): ICreepConfig => ({
  // 根据敌人威胁决定是否继续生成
  isNeed: room => {
    const source = Game.getObjectById(data.sourceId as Id<StructureContainer>);

    // 如果能量来源没了就删除自己
    if (!source) return false;
    // 如果能量来源是 container 的话说明还在发展期，只要 container 在就一直孵化
    else if (source && source instanceof StructureContainer) return true;

    // 否则就看当前房间里有没有威胁，有的话就继续孵化并刷墙
    return room.controller.checkEnemyThreat();
  },
  source: creep => {
    const source =
      Game.getObjectById(data.sourceId as Id<StructureContainer>) || creep.room.storage || creep.room.terminal;

    // 能量不足就先等待，优先满足 filler 需求
    if (source.store[RESOURCE_ENERGY] < 500) {
      creep.say("🎮");
      return false;
    }
    creep.getEngryFrom(source);

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;
    else return false;
  },
  // 一直修墙就完事了
  target: creep => {
    let importantWall = creep.room.importantWall;
    // 先尝试获取焦点墙，有最新的就更新缓存，没有就用缓存中的墙
    if (importantWall) creep.memory.fillWallId = importantWall.id;
    else if (creep.memory.fillWallId)
      importantWall = Game.getObjectById(creep.memory.fillWallId as Id<StructureWall | StructureRampart>);

    // 有焦点墙就优先刷
    if (importantWall) {
      const actionResult = creep.repair(creep.room.importantWall);
      if (actionResult === OK) {
        // 离墙三格远可能正好把路堵上，所以要走进一点
        if (!creep.room.importantWall.pos.inRangeTo(creep.pos, 2)) creep.goTo(creep.room.importantWall.pos);
      } else if (actionResult === ERR_NOT_IN_RANGE) creep.goTo(creep.room.importantWall.pos);
    }
    // 否则就按原计划维修
    else creep.fillDefenseStructure();

    if (creep.store.getUsedCapacity() === 0) return true;
    else return false;
  },
  bodys: "worker"
});
