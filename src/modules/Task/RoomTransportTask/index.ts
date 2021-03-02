/**
 * 房间物流任务模块
 *
 * 该模块处理房间中的物流任务，包括：spawn、extension、tower 能量填充，lab 运输等等
 * 但是该模块不负责中央集群的物流任务
 */

import RoomTransport from "./taskController";

/**
 * 所有的房间物流对象都被存放到这里
 */
const transportManagers: { [roomName: string]: RoomTransport } = {};

/**
 * 向房间原型挂载物流对象
 */
export default function (): void {
  Object.defineProperty(Room.prototype, "transport", {
    get() {
      if (!((this as Room).name in transportManagers)) {
        transportManagers[(this as Room).name] = new RoomTransport((this as Room).name);
      }

      return transportManagers[(this as Room).name];
    },
    enumerable: false,
    configurable: true
  });
}
