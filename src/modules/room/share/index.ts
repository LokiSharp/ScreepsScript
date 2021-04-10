/**
 * 房间间资源共享控制器
 */
import RoomShareController from "./controller";
import createGetter from "@/utils/global/createGetter";

/**
 * 所有的控制器都被存放到这里
 */
const controllers: { [roomName: string]: RoomShareController } = {};

/**
 * 向房间原型挂载控制器对象
 *
 * @param key 要挂载到 Room 的哪个键上
 */
export default function (key = "share"): void {
  createGetter(Room, key, function () {
    if (!((this as Room).name in controllers)) {
      controllers[(this as Room).name] = new RoomShareController((this as Room).name);
    }
    return controllers[(this as Room).name];
  });
}
