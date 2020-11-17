import CreepControl from "./CreepControl";
import RoomConsole from "./RoomConsole";
import RoomExtension from "./RoomExtension";
import RoomHelp from "./RoomHelp";
import RoomShortcut from "./RoomShortcut";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [RoomShortcut, RoomExtension, RoomConsole, CreepControl, RoomHelp];

/**
 * 依次挂载所有的 Room 拓展
 */
export default function mountRoom(): void {
  plugins.forEach(plugin => assignPrototype(Room, plugin));
}
