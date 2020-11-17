/**
 * 检查旗帜是否失效
 * 会完成失效后的释放操作
 *
 * @param flagName 要检查的旗帜名称
 */
export function checkAliveFlag(flagName: string): boolean {
  if (flagName in Game.flags) return true;

  if (Memory.flags) delete Memory.flags[flagName];
  return false;
}
