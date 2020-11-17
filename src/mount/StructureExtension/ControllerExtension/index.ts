import ControllerExtension from "./ControllerExtension";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [ControllerExtension];

/**
 * 依次挂载所有拓展
 */
export default function mountController(): void {
  plugins.forEach(plugin => assignPrototype(StructureController, plugin));
}
