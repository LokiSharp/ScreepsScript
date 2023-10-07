import { structureIdCache } from "./structureIdCache";

/**
 * 设置建筑 ID 缓存
 *
 * 本方法会直接 **替换** 目标位置的旧缓存
 *
 * @param roomName 要设置到的房间
 * @param type 要设置到的建筑类型
 * @param ids 要设置的 id
 */
export function setCacheId(roomName: string, type: AllRoomShortcut, ids: Id<ObjectWithId>[]): Id<ObjectWithId>[] {
  if (!structureIdCache[roomName]) structureIdCache[roomName] = {};
  if (!structureIdCache[roomName][type]) structureIdCache[roomName][type] = [];

  return (structureIdCache[roomName][type] = ids);
}
