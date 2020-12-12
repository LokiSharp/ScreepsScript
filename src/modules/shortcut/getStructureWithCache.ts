import { getCacheId } from "./getCacheId";
import { getPrivateKey } from "./getPrivateKey";
import { initShortcutCache } from "./initShortcutCache";
import { setCacheId } from "./setCacheId";

/**
 * [核心实现] 获取指定房间的建筑缓存
 *
 * @param room 目标房间
 * @param type 要获取的建筑类型
 *
 * @returns 对应的建筑**数组**
 */
export function getStructureWithCache<TargetStructure extends RoomObject>(
  room: Room,
  type: AllRoomShortcut
): TargetStructure[] {
  const privateKey = getPrivateKey(type);

  // 本 tick 有缓存就直接返回
  if (room[privateKey]) return room[privateKey] as TargetStructure[];

  let ids = getCacheId(room.name, type);
  // 缓存中没有 id 说明还没进行初始化
  if (!ids) {
    initShortcutCache(room);
    ids = getCacheId(room.name, type);
  }
  // 还没有的话就是真没有，直接返回空
  if (!ids || ids.length === 0) return [];

  // 从 id 获取建筑并更新缓存
  const target: TargetStructure[] = [];
  const availableId = ids.filter((id: Id<TargetStructure>) => {
    const structure = Game.getObjectById(id);
    if (!structure) return false;

    target.push(structure);
    return true;
  });

  setCacheId(room.name, type, availableId);

  // 否则就暂存对象并返回
  room[privateKey] = target;
  return target;
}
