import PowerSpawnConsole from "./PowerSpawnConsole";
import PowerSpawnExtension from "./PowerSpawnExtension";
import PowerSpawnHelp from "./PowerSpawnHelp";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [PowerSpawnExtension, PowerSpawnConsole, PowerSpawnHelp];

/**
 * 依次挂载所有拓展
 */
export default function mountPowerSpawn(): void {
  plugins.forEach(plugin => assignPrototype(StructurePowerSpawn, plugin));
}
