import TerminalExtension from "./TerminalExtension";
import { createHelp } from "@/modules/help";

/**
 * Terminal 上的用户控制接口
 */
export default class TerminalHelp extends TerminalExtension {
  public help(): string {
    return createHelp({
      name: "Terminal 控制台",
      describe: "通过设置监听规则来自动化管理多房间共享、对外交易等资源物流工作",
      api: [
        {
          title: "添加资源监听",
          describe: "新增期望值和交易规则，terminal 会自动对其监听并维持期望",
          params: [
            { name: "resourceType", desc: "终端要监听的资源类型(只会监听自己库存中的数量)" },
            { name: "amount", desc: "指定类型的期望数量" },
            { name: "mod", desc: "[可选] 监听类型，分为 0(获取，默认), 1(对外提供)" },
            { name: "channel", desc: "[可选] 渠道，分为 0(拍单，默认), 1(挂单), 2(共享)，3(支援)" },
            { name: "priceLimit", desc: "[可选] 价格限制，若不填则通过历史平均价格检查" },
            { name: "supportRoomName", desc: "[可选] 要支援的房间名，在 channel 为 3 时生效" }
          ],
          functionName: "add"
        },
        {
          title: "移除资源监听",
          describe: "该操作会自动从 storage 里取出能量",
          params: [{ name: "index", desc: "移除监听的任务索引" }],
          functionName: "remove"
        },
        {
          title: "列出所有监听任务",
          functionName: "show"
        },
        {
          title: "重设默认监听",
          params: [{ name: "hard", desc: "[可选] 将移除非默认的监听任务，默认为 false" }],
          functionName: "reset"
        }
      ]
    });
  }
}
