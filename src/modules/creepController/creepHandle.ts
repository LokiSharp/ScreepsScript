import { creepApi } from "./creepApi";
import creepWorks from "@/role";
import log from "@/utils/console/log";

/**
 * 处理去世的 creep
 * 会检查其是否需要再次孵化
 *
 * @param creepName creep 名字
 * @param creepMemory creep 死时的内存
 */

export const handleNotExistCreep = function (creepName: string, creepMemory: CreepMemory): void {
  if (Memory.creeps[creepName].role === "worker") {
    Game.rooms[(Memory.creeps[creepName].data as WorkerData).workRoom].work.getUnit();
  }
  if (Memory.creeps[creepName].role === "manager") {
    Game.rooms[(Memory.creeps[creepName].data as ManagerData).workRoom].transport.getUnit();
  }
  const creepConfig = Memory.creepConfigs[creepName];

  // 获取配置项
  if (!creepConfig) {
    log(`死亡 ${creepName} 未找到对应 creepConfig, 已删除`, ["creepController"]);
    delete Memory.creeps[creepName];
    return;
  }

  // 检查指定的 room 中有没有它的生成任务
  const spawnRoom = Game.rooms[creepConfig.spawnRoom];
  if (!spawnRoom) {
    log(`死亡 ${creepName} 未找到 ${creepConfig.spawnRoom}, 已删除`, ["creepController"]);
    delete Memory.creeps[creepName];
    return;
  }

  const creepWork = creepWorks[creepConfig.role];
  // 通过 isNeed 阶段判断该 creep 是否要继续孵化
  // 没有提供 isNeed 阶段的话则默认需要重新孵化
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (creepWork.isNeed && !creepWork.isNeed(spawnRoom, creepMemory)) {
    // creep 不需要了，遗弃该 creep
    creepApi.remove(creepName);
    delete Memory.creeps[creepName];
    return;
  }

  // 加入生成，加入成功的话删除过期内存
  if (spawnRoom.addSpawnTask(creepName) !== ERR_NAME_EXISTS) delete Memory.creeps[creepName];
};
