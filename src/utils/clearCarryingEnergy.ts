/**
 * 处理掉 creep 身上携带的能量
 * 运输者在之前处理任务的时候身上可能会残留能量，如果不及时处理的话可能会导致任务处理能力下降
 *
 * @param creep 要净空的 creep
 * @returns 为 true 时代表已经处理完成，可以继续执行任务
 */
export function clearCarryingEnergy(creep: Creep): boolean {
  if (creep.store[RESOURCE_ENERGY] > 0) {
    // 能放下就放，放不下说明能量太多了，直接扔掉
    if (creep.room.storage && creep.room.storage.store.getFreeCapacity() >= creep.store[RESOURCE_ENERGY])
      creep.transferTo(creep.room.storage, RESOURCE_ENERGY);
    else creep.drop(RESOURCE_ENERGY);

    return false;
  }

  return true;
}
