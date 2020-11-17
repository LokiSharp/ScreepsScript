import RoomPostionExtension from "./RoomPostionExtension";
import assignPrototype from "utils/global/assignPrototype";

/**
 * 挂载 RoomPosition 拓展
 */
export default function mountRoomPosition(): void {
  assignPrototype(RoomPosition, RoomPostionExtension);
}
