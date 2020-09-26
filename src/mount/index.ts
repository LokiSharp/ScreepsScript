import mountCreep from "./creep";
import mountRoom from "./room";
import mountRoomPostio from "./roomPosition";
import mountStructure from "./structures";
/**
 * 挂载所有的额外属性和方法
 */
export default function (): void {
  if (!global.hasExtension) {
    console.log("[mount] 重新挂载拓展");

    // 存储的兜底工作
    initStorage();
    mountRoom();
    mountRoomPostio();
    mountCreep();
    mountStructure();
    global.hasExtension = true;
  }
}

/**
 * 初始化存储
 */
function initStorage() {
  if (!Memory.rooms) Memory.rooms = {};
  else delete Memory.rooms.undefined;

  if (!Memory.creepConfigs) Memory.creepConfigs = {};
}
