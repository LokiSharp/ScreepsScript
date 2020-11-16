/**
 * 处理掉 creep 身上携带的资源
 * 运输者在之前处理任务的时候身上可能会残留资源，如果不及时处理的话可能会导致任务处理能力下降
 *
 * @param creep 要清空的 creep
 * @returns 为 true 时代表已经处理完成，可以继续执行任务
 */
export function clearCarryingResource(creep: Creep): boolean {
  if (creep.store.getUsedCapacity() > 0) {
    // 能放下就放，放不下说明资源太多了，直接扔掉
    if (creep.room.storage && creep.room.storage.store.getFreeCapacity() >= creep.store.getUsedCapacity()) {
      Object.keys(creep.store).forEach(key => {
        if (creep.store[key] > 0) creep.transferTo(creep.room.storage, key as ResourceConstant);
      });
    } else creep.drop(Object.keys(creep.store)[0] as ResourceConstant);

    return false;
  }

  return true;
}
