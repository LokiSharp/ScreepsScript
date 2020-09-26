import RoomExtension from "./extension";
import RoomShortcut from "./shortcut";
import { assignPrototype } from "utils/prototype";

// 定义好挂载顺序
const plugins = [RoomShortcut, RoomExtension];

/**
 * 依次挂载所有的 Room 拓展
 */
export default (): void => plugins.forEach(plugin => assignPrototype(Room, plugin));
