import { manageStructure } from "modules/autoPlanning";
import mountCreepExtension from "./CreepExtension";
import mountGlobalExtension from "./GlobalExtension";
import mountPowerCreepExtension from "./PowerCreepExtension";
import mountRoomExtension from "./RoomExtension";
import mountRoomPositionExtension from "./RoomPostionExtension";
import mountStructureExtension from "./StructureExtension";

/**
 * 挂载所有的额外属性和方法
 */
export default function mountExtension(): void {
  if (!global.hasExtension) {
    console.log("[mount] 重新挂载拓展");

    // 存储的兜底工作
    initStorage();

    mountGlobalExtension();
    mountRoomExtension();
    mountRoomPositionExtension();
    mountCreepExtension();
    mountPowerCreepExtension();
    mountStructureExtension();
    global.hasExtension = true;

    workAfterMount();
  }
}

/**
 * 初始化存储
 */
function initStorage() {
  if (!Memory.rooms) Memory.rooms = {};
  else delete Memory.rooms.undefined;

  if (!Memory.stats) Memory.stats = { rooms: {} };
  if (!Memory.delayTasks) Memory.delayTasks = [];
  if (!Memory.creepConfigs) Memory.creepConfigs = {};
  if (!Memory.resourceSourceMap) Memory.resourceSourceMap = {};
}

// 挂载完成后要执行的一些作业
function workAfterMount() {
  // 对所有的房间执行建筑规划，防止有房间缺失建筑
  Object.values(Game.rooms).forEach(room => {
    if (!room.controller || !room.controller.my) return;
    manageStructure(room);
  });

  // 把已经孵化的 pc 能力注册到其所在的房间上，方便房间内其他 RoomObject 查询并决定是否发布 power 任务
  Object.values(Game.powerCreeps).forEach(pc => {
    if (!pc.room) return;
    pc.updatePowerToRoom();
  });
}
