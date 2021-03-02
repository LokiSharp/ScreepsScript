import CreepControl from "./CreepControl";
import RoomConsole from "./RoomConsole";
import RoomExtension from "./RoomExtension";
import RoomHelp from "./RoomHelp";
import assignPrototype from "@/utils/global/assignPrototype";
import mountShortcut from "@/modules/shortcut/mountShortcut";
import mountTransport from "@/modules/Task/RoomTransportTask";
import mountWork from "@/modules/Task/RoomWorkTask";

export { RoomExtension, RoomConsole, RoomHelp };

/**
 * 依次挂载所有的 Room 拓展
 */
export default function mountRoom(): void {
  // 挂载快捷方式
  mountShortcut();
  // 挂载任务队列
  mountTransport();
  mountWork();

  assignPrototype(Room, CreepControl);
}
