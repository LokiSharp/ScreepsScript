/**
 * 生成控制台链接
 * @param content 要显示的内容
 * @param url 要跳转到的 url
 * @param newTab 是否在新标签页打开
 */
export function createLink(content: string, url: string, newTab = true): string {
  return `<a href="${url}" target="${newTab ? "_blank" : "_self"}">${content}</a>`;
}
