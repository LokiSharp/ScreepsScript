import CreepControl from "./CreepControl";
import RoomConsole from "./RoomConsole";
import RoomExtension from "./RoomExtension";
import RoomShortcut from "./RoomShortcut";
import assignPrototype from "utils/assignPrototype";

// 定义好挂载顺序
const plugins = [RoomShortcut, RoomExtension, RoomConsole, CreepControl];

/**
 * 依次挂载所有的 Room 拓展
 */
export default (): void => plugins.forEach(plugin => assignPrototype(Room, plugin));
