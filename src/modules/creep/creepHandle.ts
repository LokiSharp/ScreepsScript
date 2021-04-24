import log from "@/utils/console/log";
import roles from "@/role";

/**
 * 通知对应的房间任务管理器，他的一个工人凉了
 *
 * @param creepName 正在做任务的 creep 名字
 * @param role 该 creep 的角色
 * @param data 该 creep 的 memory.data
 */
const removeSelfFromTask = function (creepName: string, role: CreepRoleConstant, data: CreepData): void {
  if (!("workRoom" in data)) return;

  const workRoom = Game.rooms[data.workRoom];
  if (!workRoom) return;

  const controller = role === "manager" ? workRoom.transport : workRoom.work;
  controller.removeCreep(creepName);
};

/**
 * 处理去世的 creep
 * 会检查其是否需要再次孵化
 *
 * @param creepName creep 名字
 * @param creepMemory creep 死时的内存
 */
export function handleNotExistCreep(creepName: string, creepMemory: CreepMemory): void {
  const { spawnRoom: spawnRoomName, data, role, taskKey } = creepMemory;

  // 如果有 taskKey，说明还在做任务，去访问对应的任务管理器把自己注销一下
  if (taskKey) removeSelfFromTask(creepName, role, data);

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
