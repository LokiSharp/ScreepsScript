import FactoryConsole from "./FactoryConsole";
import FactoryExtension from "./FactoryExtension";
import FactoryHelp from "./FactoryHelp";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [FactoryExtension, FactoryConsole, FactoryHelp];

/**
 * 依次挂载所有的 Room 拓展
 */
export default (): void => plugins.forEach(plugin => assignPrototype(StructureFactory, plugin));
