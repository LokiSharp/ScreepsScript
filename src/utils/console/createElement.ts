import sendCommandToConsole from "./sendCommandToConsole";

/**
 * 在控制台中创建 HTML 元素的方法集合
 */
export default class createElement {
  public static style = `<style>
            input {
                background-color: #2b2b2b;
                border: none;
                border-bottom: 1px solid #888;
                padding: 3px;
                color: #ccc;
            }
            select {
                border: none;
                background-color: #2b2b2b;
                color: #ccc;
            }
            button {
                border: 1px solid #888;
                cursor: pointer;
                background-color: #2b2b2b;
                color: #ccc;
            }
        </style>`;

  public static customStyle(): string {
    return this.style.replace(/\n/g, "").replace(/\s\s/g, "");
  }

  /**
   * 创建 input 输入框
   * @param detail 创建需要的信息
   */
  public static input(detail: InputDetail): string {
    return `${detail.label || ""} <input name="${detail.name}" placeholder="${detail.placeholder || ""}"/>`;
  }

  /**
   * 创建 select 下拉框
   * @param detail 创建需要的信息
   */
  public static select(detail: SelectDetail): string {
    const parts = [`${detail.label || ""} <select name="${detail.name}">`];
    parts.push(...detail.options.map(option => ` <option value="${option.value}">${option.label}</option>`));
    parts.push(`</select>`);

    return parts.join("");
  }

  /**
   * 创建按钮
   * 按钮绑定的命令会在点击后发送至游戏控制台
   * @param detail 创建需要的信息
   */
  public static button(detail: ButtonDetail): string {
    return `<button onclick="${sendCommandToConsole(detail.command)}">${detail.content}</button>`;
  }

  /**
   * 创建表单
   * @param name 表单的名称
   * @param details 表单元素列表
   * @param buttonDetail 按钮的信息
   */
  public static form(name: string, details: HTMLElementDetail[], buttonDetail: ButtonDetail): string {
    // 创建唯一的表单名
    const formName = name + Game.time.toString();

    // 添加样式和表单前标签
    const parts = [this.customStyle(), `<form name='${formName}'>`];

    // 添加表单内容
    parts.push(
      ...details.map(detail => {
        switch (detail.type) {
          case "input":
            return this.input(detail) + "    ";
          case "select":
            return this.select(detail) + "    ";
        }
      })
    );

    /**
     * 封装表单内容获取方法
     * 注意后面的 \`(${buttonDetail.command})(\${JSON.stringify(formDatas)\})\`
     * 这里之所以用 \ 把 ` 和 $ 转义了是因为要生成一个按钮点击时才会用到的模板字符串，通过这个方法来把表单的内容f=当做参数提供给 sendCommand 里要执行的方法
     * 如果直接填 formDatas 而不是 JSON.stringify(formDatas) 的话，会报错找不到 formdatas
     */
    const commandWarp = `(() => {
            const form = document.forms['${formName}'];
            let formDatas = {};
            [${details
              .map(detail => `'${detail.name}'`)
              .toString()}].map(eleName => formDatas[eleName] = form[eleName].value);
            angular.element(document.body).injector().get('Console').sendCommand(\`(${
              buttonDetail.command
            })(\${JSON.stringify(formDatas)})\`, 1);
        })()`;
    // 添加提交按钮
    parts.push(`<button type="button" onclick="${commandWarp.replace(/\n/g, "")}">${buttonDetail.content}</button>`);
    parts.push(`</form>`);

    // 压缩成一行
    return parts.join("").replace(/\n/g, "").replace(/\s\s/g, "");
  }
}
