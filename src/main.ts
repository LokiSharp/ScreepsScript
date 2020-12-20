import { execShard, saveShardData } from "modules/crossShard";
import ErrorMapper from "utils/global/ErrorMapper";
import creepNumberListener from "modules/creepController/creepNumberListener";
import doing from "utils/global/doing";
import generatePixel from "utils/global/generatePixel";
import mountExtension from "mount";
import { stateScanner } from "./modules/stateCollector";

export const loop = ErrorMapper.wrapLoop(() => {
  if (Memory.showCost) console.log(`-------------------------- [${Game.time}] -------------------------- `);

  // 挂载所有拓展
  mountExtension();

  // 检查跨 shard 请求
  execShard();

  // creep 数量控制
  creepNumberListener();

  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures, Game.creeps, Game.powerCreeps);

  // 搓 pixel
  generatePixel();

  // // 保存自己的跨 shard 消息
  saveShardData();

  stateScanner();
});
