import ObserverExtension from "./ObserverExtension";
import { createHelp } from "@/modules/help";

export default class ObserverHelp extends ObserverExtension {
  /**
   * 用户操作 - 帮助
   */
  public help(): string {
    return createHelp({
      name: "Observer 控制台",
      describe: "Observer 默认关闭，新增监听房间后将会启动，在监听房间中发现 pb 或者 deposit 时将会自动发布采集单位。",
      api: [
        {
          title: "新增监听房间",
          params: [{ name: "...roomNames", desc: "要监听的房间名列表" }],
          functionName: "add"
        },
        {
          title: "移除监听房间",
          params: [{ name: "...roomNames", desc: "要移除的房间名列表" }],
          functionName: "remove"
        },
        {
          title: "显示状态",
          functionName: "stats"
        },
        {
          title: "移除所有监听房间",
          functionName: "clear"
        },
        {
          title: "暂停工作",
          functionName: "off"
        },
        {
          title: "重启工作",
          functionName: "on"
        }
      ]
    });
  }
}
