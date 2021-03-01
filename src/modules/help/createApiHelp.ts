import colorful from "@/utils/console/colorful";

/**
 * 绘制单个 api 的帮助元素
 *
 * @param func api 的描述信息
 * @returns 绘制完成的字符串
 */
export function createApiHelp(func: FunctionDescribe): string {
  const contents: string[] = [];
  // 介绍
  if (func.describe) contents.push(colorful(func.describe, "green"));

  // 参数介绍
  if (func.params)
    contents.push(
      func.params
        .map(param => {
          return `  - ${colorful(param.name, "blue")}: ${colorful(param.desc, "green")}`;
        })
        .map(s => `<div class="api-content-line">${s}</div>`)
        .join("")
    );

  // 函数示例中的参数
  const paramInFunc = func.params ? func.params.map(param => colorful(param.name, "blue")).join(", ") : "";
  // 如果启用了命令模式的话就忽略其参数
  const funcCall = colorful(func.functionName, "yellow") + (func.commandType ? "" : `(${paramInFunc})`);

  // 函数示例
  contents.push(funcCall);

  const content = contents.map(s => `<div class="api-content-line">${s}</div>`).join("");
  const checkboxId = `${func.functionName}${Game.time}`;

  // return func.params ? `${title}\n${param}\n${functionName}\n` : `${title}\n${functionName}\n`

  const result = `
    <div class="api-container">
        <label for="${checkboxId}">${func.title} ${colorful(func.functionName, "yellow", true)}</label>
        <input id="${checkboxId}" type="checkbox" />
        <div class="api-content">${content}</div>
    </div>
    `;

  return result.replace(/\n/g, "");
}
