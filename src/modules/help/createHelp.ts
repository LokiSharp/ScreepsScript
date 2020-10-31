import { apiStyle } from "./apiStyle";
import { createModule } from "./createModule";
import { moduleStyle } from "./moduleStyle";

/**
 * 创建帮助信息
 * 给帮助的显示添加一点小细节
 *
 * @param modules 模块的描述
 */
export function createHelp(...modules: ModuleDescribe[]): string {
  return moduleStyle() + apiStyle() + `<div class="module-help">${modules.map(createModule).join("")}</div>`;
}
