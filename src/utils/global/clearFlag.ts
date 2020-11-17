/**
 * 移除过期的 flag 内存
 */
export function clearFlag(): string {
  const logs = ["已清理过期旗帜:"];
  for (const flagName in Memory.flags) {
    if (!Game.flags[flagName]) {
      delete Memory.flags[flagName];
      logs.push(flagName);
    }
  }

  return logs.join(" ");
}
