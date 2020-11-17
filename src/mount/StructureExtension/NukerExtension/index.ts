import NukerExtension from "./NukerExtension";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [NukerExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountNuker(): void {
  plugins.forEach(plugin => assignPrototype(StructureNuker, plugin));
}
