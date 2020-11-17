/**
 * 快死时的后事处理
 * 将资源存放在对应的地方
 * 存完了就自杀
 *
 * @param creep manager
 * @param sourceId 能量存放处
 */
export default function deathPrepare(creep: Creep, sourceId: Id<StructureWithStore>): false {
  if (creep.store.getUsedCapacity() > 0) {
    for (const resourceType in creep.store) {
      let target: StructureWithStore;
      // 不是能量就放到 terminal 里
      if (resourceType !== RESOURCE_ENERGY && resourceType !== RESOURCE_POWER && creep.room.terminal) {
        target = creep.room.terminal;
      }
      // 否则就放到 storage 或者玩家指定的地方
      else target = sourceId ? Game.getObjectById(sourceId) : creep.room.storage;

      // 转移资源
      creep.goTo(target.pos);
      creep.transfer(target, resourceType as ResourceConstant);

      return false;
    }
  } else creep.suicide();

  return false;
}
