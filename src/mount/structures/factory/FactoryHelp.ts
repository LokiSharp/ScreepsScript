import FactoryExtension from "./FactoryExtension";
import colorful from "utils/colorful";
import { createHelp } from "modules/help";

export default class FactoryHelp extends FactoryExtension {
  public help(): string {
    return createHelp({
      name: "Factory 控制台",
      describe: `工厂分为自动运行模式和手动运行模式，自动运行模式下会根据设置的目标 ${colorful(
        ".setlevel",
        "yellow"
      )}() 和生产线 ${colorful(".setchain", "yellow")}() 自行安排生产任务，手动运行模式下将一直生产指定 ${colorful(
        ".set",
        "yellow"
      )}() 的目标。`,
      api: [
        {
          title: "设置工厂等级",
          describe: "初始化方法，新工厂设置自动化请首先执行该方法，一旦工厂被 power 后将无法修改",
          params: [{ name: "level", desc: "该工厂的生产等级， 1~5 之一" }],
          functionName: "setlevel"
        },
        {
          title: "设置生产线",
          describe: "初始化方法，需要先执行 .setlevel，会覆盖之前的设置",
          params: [
            {
              name: "...depositTypes",
              desc:
                "生产线类型，必须为下列常量 RESOURCE_MIST RESOURCE_BIOMASS RESOURCE_METAL RESOURCE_SILICON，可以指定多个"
            }
          ],
          functionName: "setchain"
        },
        {
          title: "显示工厂详情",
          functionName: "stats"
        },
        {
          title: "指定生产目标",
          describe: "工厂将无视 setLevel 的配置，一直生产该目标",
          params: [
            { name: "target", desc: "要生产的目标产物" },
            { name: "clear", desc: "[可选] 是否清理工厂之前的遗留任务，默认为 true" }
          ],
          functionName: "set"
        },
        {
          title: "移除生产目标",
          describe: "工厂将恢复自动规划",
          functionName: "clear"
        },
        {
          title: "暂停工厂",
          functionName: "off"
        },
        {
          title: "重启工厂",
          describe: "会将工厂从休眠中唤醒",
          functionName: "on"
        },
        {
          title: "移除工厂配置",
          describe: "将会把工厂还原为初始状态（移出所有物品并卸载相关内存）",
          functionName: "remove"
        }
      ]
    });
  }
}
