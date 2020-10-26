/**
 * 在绘制控制台信息时使用的颜色
 */
const colors: { [name in Colors]: string } = {
  red: "#ef9a9a",
  green: "#6b9955",
  yellow: "#c5c599",
  blue: "#8dc5e3"
};

/**
 * 给指定文本添加颜色
 *
 * @param content 要添加颜色的文本
 * @param colorName 要添加的颜色常量字符串
 * @param bolder 是否加粗
 */
export default function colorful(content: string, colorName: Colors = null, bolder = false): string {
  const colorStyle = colorName ? `color: ${colors[colorName]};` : "";
  const bolderStyle = bolder ? "font-weight: bolder;" : "";

  return `<text style="${[colorStyle, bolderStyle].join(" ")}">${content}</text>`;
}
