import { MULTIPLE_STRUCTURES } from "./MULTIPLE_STRUCTURES";
import { SINGLE_STRUCTURES } from "./SINGLE_STRUCTURES";
import { getPrivateKey } from "./getPrivateKey";
import { structureIdCache } from "./structureIdCache";

/**
 * 初始化指定房间的建筑缓存
 *
 * @param room 要初始化的房间
 */
export function initShortcutCache(room: Room): void {
  structureIdCache[room.name] = {};

  // 查找建筑
  const structureGroup = _.groupBy(room.find(FIND_STRUCTURES), s => s.structureType);
  // 查找静态资源
  Object.assign(structureGroup, {
    mineral: room.find(FIND_MINERALS),
    source: room.find(FIND_SOURCES)
  });

  // 把需要的建筑 id 存入全局缓存，并直接初始化 room 缓存
  [...MULTIPLE_STRUCTURES, ...SINGLE_STRUCTURES].forEach(type => {
    // 如果房间内某种建筑还没有的话就填充为空数组
    structureIdCache[room.name][type] = (structureGroup[type] || []).map(s => s.id);
    room[getPrivateKey(type)] = structureGroup[type] || [];
  });
}
