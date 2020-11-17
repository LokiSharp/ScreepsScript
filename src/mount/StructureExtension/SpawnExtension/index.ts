import SpawnExtension from "./SpawnExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [SpawnExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountSpawn(): void {
  plugins.forEach(plugin => assignPrototype(StructureSpawn, plugin));
}
