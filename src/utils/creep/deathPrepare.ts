/**
 * 快死时的后事处理
 * 将资源存放在对应的地方
 * 存完了就自杀
 *
 * @param creep manager
 */
export default function deathPrepare(creep: Creep): false {
  if (creep.store.getUsedCapacity() > 0 && (creep.room.terminal || creep.room.storage)) {
    for (const resourceType in creep.store) {
      // eslint-disable-next-line no-prototype-builtins
      if (creep.store.hasOwnProperty(resourceType)) {
        let target: StructureWithStore;
        // 不是能量就放到 terminal 里
        if (resourceType !== RESOURCE_ENERGY && resourceType !== RESOURCE_POWER && creep.room.terminal) {
          target = creep.room.terminal;
        }
        // 否则就放到 storage 或者玩家指定的地方
        else if (creep.room.storage) target = creep.room.storage;

        // 转移资源
        creep.goTo(target.pos);
        creep.transfer(target, resourceType as ResourceConstant);

        return false;
      }
    }
  } else creep.suicide();

  return false;
}
