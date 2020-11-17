import LinkExtension from "./LinkExtension";
import { LinkHelp } from "./LinkHelp";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [LinkExtension, LinkHelp];

/**
 * 依次挂载所有的 Room 拓展
 */
export default function mountLink(): void {
  plugins.forEach(plugin => assignPrototype(StructureLink, plugin));
}
