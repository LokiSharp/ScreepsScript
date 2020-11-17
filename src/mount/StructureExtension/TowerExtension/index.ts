import TowerExtension from "./TowerExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [TowerExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountTower(): void {
  plugins.forEach(plugin => assignPrototype(StructureTower, plugin));
}
