import { MULTIPLE_STRUCTURES } from "./MULTIPLE_STRUCTURES";
import { SINGLE_STRUCTURES } from "./SINGLE_STRUCTURES";

/**
 * 判断某个建筑类型是否为需要挂载的建筑类型
 *
 * @param type 要进行判断的建筑类型
 */
export function isShortcutStructure(type: string): type is AllRoomShortcut {
  return ([...SINGLE_STRUCTURES, ...MULTIPLE_STRUCTURES] as string[]).includes(type);
}
