import colorful from "./colorful";

/**
 * 快捷生成单个常量帮助
 *
 * @param name 常量简称
 * @param constant 常量名
 */
export default function createConst(name: string, constant: string): string {
  return `${colorful(name, "green")} ${colorful(constant, "blue")}`;
}
