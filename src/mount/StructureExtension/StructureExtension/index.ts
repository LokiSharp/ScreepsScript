import StructureExtension from "./StructureExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [StructureExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountStructure(): void {
  plugins.forEach(plugin => assignPrototype(Structure, plugin));
}
