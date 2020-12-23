import { execShard, saveShardData } from "./modules/crossShard";
import { getCpuUsage, stateScanner } from "./modules/stateCollector";
import ErrorMapper from "./utils/global/ErrorMapper";
import creepNumberListener from "modules/creepController/creepNumberListener";
import doing from "./utils/global/doing";
import generatePixel from "./utils/global/generatePixel";
import mountExtension from "./mount";

export const loop = ErrorMapper.wrapLoop(() => {
  getCpuUsage("start");

  // 挂载所有拓展
  mountExtension();
  getCpuUsage("mountExtension");
  // 检查跨 shard 请求
  execShard();
  getCpuUsage("execShard");
  // creep 数量控制
  creepNumberListener();
  getCpuUsage("creepNumberListener");
  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures);
  getCpuUsage("doing structures");
  doing(Game.creeps);
  getCpuUsage("doing creeps");
  doing(Game.powerCreeps);
  getCpuUsage("doing powerCreeps");
  // 搓 pixel
  generatePixel();
  getCpuUsage("generatePixel");
  // // 保存自己的跨 shard 消息
  saveShardData();
  getCpuUsage("saveShardData");
  stateScanner();
  getCpuUsage("stateScanner");
});
