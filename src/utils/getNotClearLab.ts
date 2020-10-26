/**
 * 获取还没有清空的 lab
 *
 * @param labMemory 房间中的 lab 集群内存
 */
export function getNotClearLab(labMemory: LabMemory): StructureLab {
  for (const outLabId in labMemory.outLab) {
    if (labMemory.outLab[outLabId] > 0) {
      return Game.getObjectById(outLabId as Id<StructureLab>);
    }
  }

  // 找不到的话就检查下 inLab 是否净空
  for (const labId of labMemory.inLab) {
    // 获取 inLab
    const inLab = Game.getObjectById(labId as Id<StructureLab>);
    // manager 并非 lab 集群内部成员，所以不会对 inLab 的缺失做出响应
    if (!inLab) continue;

    // 如果有剩余资源的话就拿出来
    if (inLab.mineralType) return inLab;
  }

  return undefined;
}
