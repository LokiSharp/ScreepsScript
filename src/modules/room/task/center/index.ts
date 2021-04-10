/**
 * 房间中央物流任务模块
 *
 * 该模块处理房间里中央集群的物流任务，包括 factory、terminal、storage、center link 之间的资源流转
 */
import RoomCenterTaskController from "./taskController";
import createGetter from "@/utils/global/createGetter";

/**
 * 所有的房间物流对象都被存放到这里
 */
const controllers: { [roomName: string]: RoomCenterTaskController } = {};

/**
 * 向房间原型挂载物流对象
 *
 * @param key 要挂载到 Room 的哪个键上
 */
export default function (key = "centerTransport"): void {
  createGetter(Room, key, function () {
    if (!((this as Room).name in controllers)) {
      controllers[(this as Room).name] = new RoomCenterTaskController((this as Room).name);
    }
    return controllers[(this as Room).name];
  });
}
