import RoomPostionExtension from "./extension";
import { assignPrototype } from "utils/prototype";

/**
 * 挂载 RoomPosition 拓展
 */
export default (): void => assignPrototype(RoomPosition, RoomPostionExtension);