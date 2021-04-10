/**
 * 获取指定房间的建筑缓存（从内存中保存的 id）
 *
 * @param room 目标房间
 * @param privateKey 建筑缓存在目标房间的键
 * @param memoryKey 建筑 id 在房间内存中对应的字段名
 * @returns 对应的建筑
 */
export function getStructureWithMemory<TargetStructure extends RoomObject>(
  room: Room,
  privateKey: string,
  memoryKey: string
): TargetStructure {
  if (room[privateKey]) return room[privateKey] as TargetStructure;

  // 内存中没有 id 就说明没有该建筑
  if (!room.memory[memoryKey]) return undefined;

  // 从 id 获取建筑并缓存
  const target: TargetStructure = Game.getObjectById(room.memory[memoryKey]);

  // 如果保存的 id 失效的话，就移除缓存
  if (!target) {
    delete room.memory[memoryKey];
    return undefined;
  }

  // 否则就暂存对象并返回
  room[privateKey] = target;
  return target;
}
