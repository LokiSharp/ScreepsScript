import PowerSpawnExtension from "./PowerSpawnExtension";
import colorful from "@/utils/console/colorful";
import { createHelp } from "@/modules/help";

export default class PowerSpawnHelp extends PowerSpawnExtension {
  /**
   * 用户操作 - 帮助信息
   */
  public help(): string {
    return createHelp({
      name: "PowerSpawn 控制台",
      describe: `ps 默认不启用，执行 ${colorful(".on", "yellow")}() 方法会启用 ps。启用之后会进行 power 自动平衡。`,
      api: [
        {
          title: "启动/恢复处理 power",
          functionName: "on"
        },
        {
          title: "暂停处理 power",
          functionName: "off"
        },
        {
          title: "查看当前状态",
          functionName: "stats"
        }
      ]
    });
  }
}
