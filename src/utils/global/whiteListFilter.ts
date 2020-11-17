/**
 * 判断是否为白名单玩家
 *
 * @param creep 要检查的 creep
 * @returns 是否为白名单玩家
 */
export function whiteListFilter(creep: Creep): boolean {
  if (!Memory.whiteList) return true;
  // 加入白名单的玩家单位不会被攻击，但是会被记录
  if (creep.owner.username in Memory.whiteList) {
    Memory.whiteList[creep.owner.username] += 1;
    return false;
  }

  return true;
}
