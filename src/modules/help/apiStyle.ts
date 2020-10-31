export function apiStyle(): string {
  const style = `
    <style>
    .api-content-line {
        width: max-content;
        padding-right: 15px;
    }
    .api-container {
        margin: 5px;
        width: 250px;
        background-color: #2b2b2b;
        overflow: hidden;
        display: flex;
        flex-flow: column;
    }

    .api-container label {
        transition: all 0.1s;
        min-width: 300px;

    }

    /* 隐藏input */
    .api-container input {
        display: none;
    }

    .api-container label {
        cursor: pointer;
        display: block;
        padding: 10px;
        background-color: #3b3b3b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .api-container label:hover, label:focus {
        background-color: #525252;
    }

    /* 清除所有展开的子菜单的 display */
    .api-container input + .api-content {
        overflow: hidden;
        transition: all 0.1s;
        width: auto;
        max-height: 0px;
        padding: 0px 10px;
    }

    /* 当 input 被选中时，给所有展开的子菜单设置样式 */
    .api-container input:checked + .api-content {
        max-height: 200px;
        padding: 10px;
        background-color: #1c1c1c;
        overflow-x: auto;
    }
    </style>`;

  return style.replace(/\n/g, "");
}
