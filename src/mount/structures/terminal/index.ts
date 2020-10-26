import TerminalConsole from "./TerminalConsole";
import TerminalExtension from "./TerminalExtension";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [TerminalExtension, TerminalConsole];

/**
 * 依次挂载所有的 Room 拓展
 */
export default (): void => plugins.forEach(plugin => assignPrototype(StructureTerminal, plugin));
