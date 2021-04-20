import log from "@/utils/console/log";
import roles from "@/role";

/**
 * 处理去世的 creep
 * 会检查其是否需要再次孵化
 *
 * @param creepName creep 名字
 * @param creepMemory creep 死时的内存
 */

export function handleNotExistCreep(creepName: string, creepMemory: CreepMemory): void {
  if (Memory.creeps[creepName].role === "worker") {
    Game.rooms[(Memory.creeps[creepName].data as WorkerData).workRoom].work.getUnit();
  }
  if (Memory.creeps[creepName].role === "manager") {
    Game.rooms[(Memory.creeps[creepName].data as ManagerData).workRoom].transport.getUnit();
  }
  const { spawnRoom: spawnRoomName, data, role } = creepMemory;

  // 禁止孵化的 creep 直接移除
  if (creepMemory.cantRespawn) {
    log(`死亡 ${creepName} 被禁止孵化, 已删除`, ["creep"]);
    delete Memory.creeps[creepName];
    return;
  }

  // 检查指定的 room 中有没有它的生成任务
  const spawnRoom = Game.rooms[spawnRoomName];
  if (!spawnRoom) {
    log(`死亡 ${creepName} 未找到 ${spawnRoomName}, 已删除`, ["creep"]);
    delete Memory.creeps[creepName];
    return;
  }

  const creepWork: CreepConfig<CreepRoleConstant> = roles[role];

  // 通过 isNeed 阶段判断该 creep 是否要继续孵化
  // 没有提供 isNeed 阶段的话则默认需要重新孵化
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (creepWork.isNeed && !creepWork.isNeed(spawnRoom, creepMemory)) {
    delete Memory.creeps[creepName];
    return;
  }

  // 加入生成，加入成功的话删除过期内存
  const result = spawnRoom.spawner.addTask({ name: creepName, role, data });

  if (result !== ERR_NAME_EXISTS) log(`死亡 ${creepName} 孵化任务已存在`, ["creep"]);
  delete Memory.creeps[creepName];
}
