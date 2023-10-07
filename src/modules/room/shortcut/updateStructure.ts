import { isShortcutStructure } from "./isShortcutStructure";
import { structureIdCache } from "./structureIdCache";

/**
 * 追加新的建筑缓存
 *
 * **新建筑造好后需要调用该方法**，
 * 该方法会将提供的缓存 id 追加到指定位置的缓存末尾
 *
 * @param roomName 房间名
 * @param type 要追加到的建筑类型
 * @param id 新的建筑 id
 */

export function updateStructure(roomName: string, type: string, id: Id<ObjectWithId>): void {
  // 传入的建筑类型有可能不需要挂载，这里剔除掉
  if (!isShortcutStructure(type)) return;

  if (!structureIdCache[roomName]) structureIdCache[roomName] = {};
  if (!structureIdCache[roomName][type]) structureIdCache[roomName][type] = [];

  structureIdCache[roomName][type].push(id);
}
