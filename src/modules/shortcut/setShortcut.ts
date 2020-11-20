import { getStructureWithCache } from "./getStructureWithCache";

/**
 * 设置建筑快捷方式
 *
 * @param isSingle 要设置的是唯一建筑还是复数建筑
 * @returns 一个函数，接受要挂载的建筑类型，并挂载至房间上
 */
export function setShortcut(isSingle: boolean) {
  return (type: AllRoomShortcut): void => {
    Object.defineProperty(Room.prototype, type, {
      get() {
        const structures = getStructureWithCache(this, type);
        return isSingle ? structures[0] : structures;
      },
      enumerable: false,
      configurable: true
    });
  };
}
