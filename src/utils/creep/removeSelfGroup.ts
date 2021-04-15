import { removeCreep } from "@/modules/creep/utils";

/**
 * pbAttacker 移除自身采集小组并自杀的封装
 *
 * @param creep pbAttacker
 * @param healerName 治疗单位名称
 * @param spawnRoomName 出生房间名
 * @returns 是否移除成功
 */
export function removeSelfGroup(creep: Creep, healerName: string, spawnRoomName: string): boolean {
  // 移除自己和 heal 的配置项
  const spawnRoom = Game.rooms[spawnRoomName];
  if (!spawnRoom) {
    creep.say("家呢？");
    return false;
  }

  // 移除角色组
  removeCreep(creep.name, { immediate: true });
  removeCreep(healerName, { immediate: true });

  // 自杀并释放采集位置
  creep.suicide();
  return true;
}
