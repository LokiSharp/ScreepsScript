/**
 * 执行 Hash Map 中子元素对象的 work 方法
 *
 * @param hashMaps 游戏对象的 hash map。如 Game.creeps、Game.spawns 等
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default function doing(...hashMaps: Object[]): void {
  hashMaps.forEach(obj => {
    // 遍历执行 work
    Object.values(obj).forEach(item => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (item.work) item.work();
    });
  });
}
