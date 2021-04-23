import RoomCenterTaskController from "@/modules/room/task/center/taskController";
import RoomConsole from "./RoomConsole";
import RoomExtension from "./RoomExtension";
import RoomHelp from "./RoomHelp";
import RoomPowerController from "@/modules/room/power/controller";
import RoomShareController from "@/modules/room/share/controller";
import RoomSpawnController from "@/modules/room/spawn";
import RoomTransportTaskController from "@/modules/room/task/transport/taskController";
import RoomWorkTaskController from "@/modules/room/task/work/taskController";
import createGetter from "@/utils/global/createGetter";
import mountShortcut from "@/modules/room/shortcut/mountShortcut";

export { RoomExtension, RoomConsole, RoomHelp };

/**
 * 房间插件
 * 实例化时必须接受当前房间名
 */

interface AnyRoomPlugin {
  new (key?: string): any;
}

/**
 * 插件存储
 */
interface PluginStorage {
  /** 插件的类别 */
  [pluginName: string]: {
    /** 插件管理的房间名 */
    [roomName: string]: AnyRoomPlugin;
  };
}

declare global {
  interface Room {
    /**
     * 资源共享模块
     */
    share: RoomShareController;
    /**
     * 工作任务模块
     */
    work: RoomWorkTaskController;
    /**
     * 物流任务模块
     */
    transport: RoomTransportTaskController;
    /**
     * 中央物流任务模块
     */
    centerTransport: RoomCenterTaskController;
    /**
     * 孵化控制模块
     */
    spawner: RoomSpawnController;
    /**
     * power 管理模块
     */
    power: RoomPowerController;
  }
}

/**
 * 依次挂载所有的 Room 拓展
 */
export default function mountRoom(): void {
  // 挂载快捷方式
  mountShortcut();

  // 等待安装的房间插件列表
  const plugins: [string, AnyRoomPlugin][] = [
    ["share", RoomShareController],
    ["centerTransport", RoomCenterTaskController],
    ["transport", RoomTransportTaskController],
    ["work", RoomWorkTaskController],
    ["spawner", RoomSpawnController],
    ["power", RoomPowerController]
  ];

  // 房间插件实例化后会被分类保存到这里
  const pluginStorage: PluginStorage = {};

  // 安装所有的插件
  plugins.forEach(([pluginName, Plugin]) => {
    pluginStorage[pluginName] = {};

    // 在房间上创建插件的访问器
    createGetter(Room, pluginName, function () {
      // 还没访问过, 进行实例化
      if (!((this as Room).name in pluginStorage[pluginName])) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        pluginStorage[pluginName][(this as Room).name] = new Plugin((this as Room).name);
      }
      // 直接返回插件实例
      return pluginStorage[pluginName][(this as Room).name];
    });
  });
}
