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
  /**
   * @danger 这里 Healer 的名称应该与发布时保持一致，但是这里并没有强相关，在 oberserver 发布角色组的代码里如果修改了 healer 的名称的话这里就会出问题
   */
  spawnRoom.release.removePbHarvesteGroup(creep.name, healerName);

  // 自杀并释放采集位置
  creep.suicide();
  return true;
}
