/**
 * 工作任务中相关的延迟任务
 */
import { MINE_LIMIT } from "@/setting";
import { addConstructionSite } from "@/modules/ConstructionController";
import { delayQueue } from "@/modules/delayQueue";

/**
 * 给指定工地添加建筑任务
 * 因为工地在下个 tick 才能被发现，所以需要延迟任务
 * 如果下个 tick 没有发现的话就会重新放置并再次发布任务尝试添加
 *
 * @param pos 该工地的位置
 * @param type 该工地的类型
 * @param handleRoomName 建筑任务要发布到那个房间，默认为 pos 所在房间
 */
export const addBuildTask = function (
  pos: RoomPosition,
  type: BuildableStructureConstant,
  handleRoomName?: string
): void {
  const { x, y, roomName } = pos;
  delayQueue.addDelayTask(
    "addBuildTask",
    {
      roomName: handleRoomName ? handleRoomName : roomName,
      pos: [x, y, roomName],
      type
    },
    Game.time + 1
  );
};

/**
 * 给指定房间添加刷墙工的延迟孵化任务
 *
 * @param roomName 添加到的房间名
 */
export const addSpawnRepairerTask = function (roomName: string): void {
  delayQueue.addDelayTask("spawnFiller", { roomName }, Game.time + 5000);
};

/**
 * 添加 miner 的延迟孵化任务
 * @param roomName 添加到的房间名
 * @param delayTime 要延迟的时间，一般都是 mineal 的重生时间
 */
export const addSpawnMinerTask = function (roomName: string, delayTime: number): void {
  delayQueue.addDelayTask("spawnMiner", { roomName }, delayTime + 1);
};

/**
 * 注册刷墙工的延迟孵化任务
 */
delayQueue.addDelayCallback("spawnFiller", room => {
  if (!room) return;

  // cpu 还是不够的话就延迟发布
  if (Game.cpu.bucket < 700) return addSpawnRepairerTask(room.name);

  room.work.updateTask({ type: "fillWall", priority: 0 });
});

/**
 * 注册 miner 的延迟孵化任务
 */
delayQueue.addDelayCallback("spawnMiner", room => {
  // 房间或终端没了就不在孵化
  if (!room || !room.terminal) return;

  // 满足以下条件时就延迟发布
  if (
    // cpu 不够
    Game.cpu.bucket < 700 ||
    // 矿采太多了
    room.terminal.store[room.mineral.mineralType] >= MINE_LIMIT
  )
    return addSpawnMinerTask(room.name, 1000);

  room.work.updateTask({ type: "mine", need: 1, priority: 0 });
});

/**
 * 注册建筑任务发布
 */
delayQueue.addDelayCallback("addBuildTask", (room, task) => {
  const [x, y, roomName] = task.pos;
  const pos = new RoomPosition(x, y, roomName);
  if (!pos) return;

  const expectedSite = pos.lookFor(LOOK_CONSTRUCTION_SITES).find(site => site.structureType === task.type);

  // 如果没有工地的话就创建并再次发布建造任务
  if (!expectedSite || !room) {
    addConstructionSite([{ pos, type: STRUCTURE_CONTAINER }]);
    addBuildTask(pos, task.type);
  }

  // 以指定工地为目标发布建筑
  room.work.addTask({ type: "build", targetId: expectedSite.id });
});
