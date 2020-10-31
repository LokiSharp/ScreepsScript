export function moduleStyle(): string {
  const style = `
    <style>
    .module-help {
        display: flex;
        flex-flow: column nowrap;
    }
    .module-container {
        padding: 0px 10px 10px 10px;
        display: flex;
        flex-flow: column nowrap;
    }
    .module-info {
        margin: 5px;
        display: flex;
        flex-flow: row nowrap;
        align-items: baseline;
    }
    .module-title {
        font-size: 19px;
        font-weight: bolder;
        margin-left: -15px;
    }
    .module-api-list {
        display: flex;
        flex-flow: row wrap;
    }
    </style>`;

  return style.replace(/\n/g, "");
}
