import TerminalConsole from "./TerminalConsole";
import TerminalExtension from "./TerminalExtension";
import TerminalHelp from "./TerminalHelp";
import assignPrototype from "utils/global/assignPrototype";

// 定义好挂载顺序
const plugins = [TerminalExtension, TerminalConsole, TerminalHelp];

/**
 * 依次挂载所有拓展
 */
export default function mountTerminal(): void {
  plugins.forEach(plugin => assignPrototype(StructureTerminal, plugin));
}
