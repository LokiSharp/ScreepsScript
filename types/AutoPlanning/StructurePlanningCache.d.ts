/**
 * 全局建筑规划缓存
 * 键为房间名，值为对应的规划结果
 */
interface StructurePlanningCache {
  [roomName: string]: StructurePlanningResult;
}
