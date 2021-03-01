/**
 * 生成 pixel
 *
 * @param cpuLimit 当 bucket 中的 cpu 到多少时才生成 pixel
 */
export default function generatePixel(cpuLimit = 9000): void {
  if (Game.cpu.bucket >= cpuLimit && Game.cpu.generatePixel && Game.shard.name !== "shard3") Game.cpu.generatePixel();
}

/**
 * 生成 pixel 的框架插件
 */
export const generatePixelAppPlugin: AppLifecycleCallbacks = {
  tickEnd: generatePixel
};
