import log from "../console/log";

/**
 * 执行 Hash Map 中子元素对象的 work 方法
 *
 * @param hashMaps 游戏对象的 hash map。如 Game.creeps、Game.spawns 等
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export default function doing(...hashMaps: Object[]): void {
  hashMaps.forEach((obj, index) => {
    const startCost = Game.cpu.getUsed();

    // 遍历执行 work
    Object.values(obj).forEach(item => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      if (item.work) item.work();
    });

    // 如果有需求的话就显示 cpu 消耗
    if (Memory.showCost) log(`消耗 ${Game.cpu.getUsed() - startCost}`, [`[${index}]`]);
  });
}
