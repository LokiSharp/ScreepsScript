import colorful from "./colorful";
import createRoomLink from "./createRoomLink";
import { factoryTopTargets } from "setting";

/**
 * 获取指定房间的工厂状态
 * 获取的信息包括：
 * 顶级产物数量，当前状态，任务数量，当前任务信息
 *
 * @param room 要获取工厂状态的房间
 */
export function getRoomFactoryState(room: Room): string {
  const memory = room.memory.factory;
  // 给房间名添加跳转链接
  const prefix = colorful(`  - [${createRoomLink(room.name)}] `, null, true);

  if (!memory) return prefix + `工厂未设置等级`;
  if (!memory.depositTypes) return prefix + `工厂未设置生产线`;

  const workStats = memory.pause
    ? colorful("暂停中", "yellow")
    : memory.sleep
    ? colorful(`${memory.sleepReason} 休眠中 剩余${memory.sleep - Game.time}t`, "yellow")
    : colorful("工作中", "green");

  // 基本信息
  const logs = [prefix + workStats, `[当前状态] ${memory.state}`, `[任务数量] ${memory.taskList.length}`];

  // 统计当前任务信息
  if (memory.taskList.length > 0) logs.push(`[任务目标] ${memory.taskList[0].target}*${memory.taskList[0].amount}`);
  // 如果有共享任务的话（有可能不属于工厂共享任务）
  if (room.memory.shareTask) {
    const share = room.memory.shareTask;
    logs.push(`[共享任务] 目标 ${share.target} 资源 ${share.resourceType} 数量 ${share.amount}`);
  }

  // 统计顶级产物数量
  if (room.terminal) {
    const topResource = _.flatten(
      memory.depositTypes.map<string[]>(type => {
        return factoryTopTargets[type][memory.level].map<string>(res => `${res}*${room.terminal.store[res]}`);
      })
    );
    logs.push("[产物数量]", ...topResource);
  } else logs.push("异常!未发现终端");

  // 组装统计信息
  return logs.join(" ");
}
