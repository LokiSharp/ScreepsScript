/**
 * 全局建筑 Id 缓存
 *
 * 在全局重置后会运行 Room.find 获取建筑并将其 id 缓存在这里
 */
export const structureIdCache: StructureIdCache = {};
