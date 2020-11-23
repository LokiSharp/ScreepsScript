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
  const abandonedIdIndex = [];

  const targets = (this as Room).memory.sourceContainersIds
    // 遍历 id，获取 container 实例
    .map((containerId, index) => {
      const container = Game.getObjectById(containerId);
      if (container) return container;

      abandonedIdIndex.push(index);
      return false;
    })
    // 去除所有为 false 的结果
    .filter(Boolean);

  // 移除失效的 id
  abandonedIdIndex.forEach(index => (this as Room).memory.sourceContainersIds.splice(index, 1));
  if ((this as Room).memory.sourceContainersIds.length <= 0) delete (this as Room).memory.sourceContainersIds;

  // 暂存对象并返回
  (this as Room).sourceContainersCache = targets as StructureContainer[];
  return (this as Room).sourceContainersCache;
}
