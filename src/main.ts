import { execShard, saveShardData } from "modules/crossShard";
import { ErrorMapper } from "utils/ErrorMapper";
import creepNumberListener from "modules/creepController";
import { doing } from "utils/doing";
import mountWork from "mount";
import { stateScanner } from "utils/stateScanner";

// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // 挂载所有拓展
  mountWork();

  // 检查跨 shard 请求
  execShard();

  // creep 数量控制
  creepNumberListener();

  // 所有建筑、creep、powerCreep 执行工作
  doing(Game.structures, Game.creeps);

  // 保存自己的跨 shard 消息
  saveShardData();

  stateScanner();

  if (Game.cpu.bucket > 9000) {
    try {
      Game.cpu.generatePixel();
    } catch (error) {
      // PASS
    }
  }
});
