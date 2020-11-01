import { PowerSpawnConsole } from "./PowerSpawnConsole";
import { PowerSpawnExtension } from "./PowerSpawnExtension";
import { PowerSpawnHelp } from "./PowerSpawnHelp";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [PowerSpawnExtension, PowerSpawnConsole, PowerSpawnHelp];

/**
 * 依次挂载所有的 Room 拓展
 */
export default (): void => plugins.forEach(plugin => assignPrototype(StructurePowerSpawn, plugin));
