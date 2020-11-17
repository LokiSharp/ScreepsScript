import StorageConsole from "./StorageConsole";
import StorageExtension from "./StorageExtension";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [StorageExtension, StorageConsole];

/**
 * 依次挂载所有拓展
 */
export default function mountStorage(): void {
  plugins.forEach(plugin => assignPrototype(StructureStorage, plugin));
}
