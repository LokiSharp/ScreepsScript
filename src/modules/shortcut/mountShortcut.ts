import { MULTIPLE_STRUCTURES } from "./MULTIPLE_STRUCTURES";
import { SINGLE_STRUCTURES } from "./SINGLE_STRUCTURES";
import { centerLinkGetter } from "./centerLinkGetter";
import createGetter from "@/utils/global/createGetter";
import { setShortcut } from "./setShortcut";
import { sourceContainersGetter } from "./sourceContainersGetter";

/**
 * 挂载房间快捷访问
 *
 * 提供对房间内资源的快捷访问方式，如：W1N1.nuker、W1N1.sources 等
 * 包括唯一型建筑（Nuker、Factory ...）复数型建筑（Spawn、extension）和自然资源（Source、Mineral ...）
 *
 * 所有可用的访问属性见上方 SINGLE_STRUCTURES 和 MULTIPLE_STRUCTURES
 */
export default function mountShortcut(): void {
  // 添加基础的快捷访问
  SINGLE_STRUCTURES.forEach(setShortcut(true));
  MULTIPLE_STRUCTURES.forEach(setShortcut(false));

  // 挂载特殊快捷方式
  createGetter(Room, "centerLink", centerLinkGetter);
  createGetter(Room, "sourceContainers", sourceContainersGetter);
}
