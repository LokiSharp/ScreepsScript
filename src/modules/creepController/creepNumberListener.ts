import { addCrossShardRequest } from "../crossShard";
import { handleNotExistCreep } from "../crossShard/handleNotExistCreep";

/**
 * creep 的数量控制器
 * 负责发现死去的 creep 并检查其是否需要再次孵化
 */

export default function creepNumberListener(): void {
  // 遍历所有 creep 内存，检查其是否存在
  for (const name in Memory.creeps) {
    if (name in Game.creeps) continue;

    // creep 的内存不可能完全未空，所以这里只有可能是 creep 主动释放（比如去了其他 shard）
    // 所以这里不予重生
    if (Object.keys(Memory.creeps[name]).length <= 0) {
      // console.log(name, '离开了', Game.shard.name)
      delete Memory.creeps[name];
      continue;
    }

    const { fromShard } = Memory.creeps[name];

    // 有 fromShard 这个字段说明是跨 shard creep，只要不是自己 shard 的，统统发送跨 shard 重生任务
    // 有 fromShard 字段并且该字段又等于自己 shard 的名字，说明该跨 shard creep 死在了本 shard 的路上
    if (fromShard && fromShard !== Game.shard.name) {
      // console.log(`向 ${fromShard} 发送 sendRespawn 任务`, JSON.stringify({ name, memory: Memory.creeps[name] }))
      addCrossShardRequest(`respawnCreep ${name}`, fromShard, "sendRespawn", {
        name,
        memory: Memory.creeps[name]
      });

      delete Memory.creeps[name];
    }

    // 如果 creep 凉在了本 shard
    else handleNotExistCreep(name, Memory.creeps[name]);
  }
}
