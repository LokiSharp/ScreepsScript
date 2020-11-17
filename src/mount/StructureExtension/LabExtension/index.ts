import LabExtension from "./LabExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [LabExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountLab(): void {
  plugins.forEach(plugin => assignPrototype(StructureLab, plugin));
}
