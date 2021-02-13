import { cpuUsageScanner, stateScanner } from "./modules/stateCollector";
import { execShard, saveShardData } from "./modules/crossShard";
import ErrorMapper from "./utils/global/ErrorMapper";
import creepNumberListener from "modules/creepController/creepNumberListener";
import doing from "./utils/global/doing";
import generatePixel from "./utils/global/generatePixel";
import { manageDelayTask } from "modules/delayQueue";
import mountExtension from "./mount";

export const loop = ErrorMapper.wrapLoop(() => {
  cpuUsageScanner("start");
  // 挂载所有拓展
  mountExtension();
  cpuUsageScanner("mountExtension");
  // 检查跨 shard 请求
  execShard();
  cpuUsageScanner("execShard");
  // creep 数量控制
  creepNumberListener();
  cpuUsageScanner("creepNumberListener");
  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures);
  cpuUsageScanner("doingStructures");
  doing(Game.creeps);
  cpuUsageScanner("doingCreeps");
  doing(Game.powerCreeps);
  cpuUsageScanner("doingPowerCreeps");
  // 处理延迟任务
  manageDelayTask();
  cpuUsageScanner("manageDelayTask");
  // 搓 pixel
  generatePixel();
  cpuUsageScanner("generatePixel");
  // // 保存自己的跨 shard 消息
  saveShardData();
  cpuUsageScanner("saveShardData");
  stateScanner();
  cpuUsageScanner("stateScanner");
});
