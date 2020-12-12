import colorful from "./colorful";

/**
 * 全局日志
 *
 * @param content 日志内容
 * @param prefixes 前缀中包含的内容
 * @param color 日志前缀颜色
 * @param notify 是否发送邮件
 */
export default function log(content: string, prefixes: string[] = [], color: Colors = null, notify = false): OK {
  // 有前缀就组装在一起
  let prefix = prefixes.length > 0 ? `【${prefixes.join(" ")}】 ` : "";
  // 指定了颜色
  prefix = colorful(prefix, color, true);

  const logContent = `${prefix}${content}`;
  console.log(logContent);
  // 转发到邮箱
  if (notify) Game.notify(logContent);

  return OK;
}
