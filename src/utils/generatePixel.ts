/**
 * 生成 pixel
 *
 * @param cpuLimit 当 bucket 中的 cpu 到多少时才生成 pixel
 */
export function generatePixel(cpuLimit = 9000): void {
  if (Game.cpu.bucket >= cpuLimit && Game.cpu.generatePixel) Game.cpu.generatePixel();
}
