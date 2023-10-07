import { structureIdCache } from "./structureIdCache";

/**
 * 获取缓存中的建筑 ID
 *
 * @param roomName 要查询的房间名
 * @param type 要查询的建筑类型
 */
export function getCacheId(roomName: string, type: AllRoomShortcut): Id<ObjectWithId>[] {
  if (!structureIdCache[roomName]) return undefined;
  if (!structureIdCache[roomName][type]) return [];

  return structureIdCache[roomName][type];
}
