import RoomConsole from "./RoomConsole";
import RoomExtension from "./RoomExtension";
import RoomHelp from "./RoomHelp";
import mountCreepRelease from "@/modules/creepController/CreepRelease";
import mountShare from "@/modules/room/share";
import mountShortcut from "@/modules/room/shortcut/mountShortcut";
import mountTransport from "@/modules/room/task/RoomTransportTask";
import mountWork from "@/modules/room/task/RoomWorkTask";

export { RoomExtension, RoomConsole, RoomHelp };

/**
 * 依次挂载所有的 Room 拓展
 */
export default function mountRoom(): void {
  // 挂载快捷方式
  mountShortcut();
  // 挂载 creep 发布
  mountCreepRelease();
  // 挂载任务队列
  mountTransport();
  mountWork();
  // 挂载房间资源共享控制器
  mountShare();
}
