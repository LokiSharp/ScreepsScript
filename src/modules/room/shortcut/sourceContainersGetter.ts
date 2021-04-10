/**
 * source 旁的 container 访问器
 * 只会检查内存中是否存在对应 id，有的话就获取 container 实例，没有的话则不会主动搜索
 * 内存中的对应 id 由新建 container 的 harvester 角色上传
 */
export function sourceContainersGetter(): StructureContainer[] {
  if ((this as Room).sourceContainersCache) return (this as Room).sourceContainersCache;

  // 内存中没有 id 就说明没有 container
  if (!(this as Room).memory.sourceContainersIds) return [];

  // container 有可能会消失，每次获取时都要把废弃的 id 移除出内存

  const targets = (this as Room).memory.sourceContainersIds
    // 遍历 id，获取 container 实例
    .map(containerId => {
      const container = Game.getObjectById(containerId);
      if (container) return container;

      return false;
    })
    // 去除所有为 false 的结果
    .filter(Boolean) as StructureContainer[];

  // 如果获取到的 container 数量和内存数量不一致的话说明有 container 失效了，更新内存
  if ((this as Room).memory.sourceContainersIds.length < targets.length) {
    if ((this as Room).memory.sourceContainersIds.length <= 0) delete (this as Room).memory.sourceContainersIds;
    else (this as Room).memory.sourceContainersIds = targets.map(target => target.id);
  }

  // 暂存对象并返回
  (this as Room).sourceContainersCache = targets;
  return (this as Room).sourceContainersCache;
}
