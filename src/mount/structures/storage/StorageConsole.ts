import { DEFAULT_ENERGY_KEEP_AMOUNT, DEFAULT_ENERGY_KEEP_LIMIT } from "setting";
import StorageExtension from "./StorageExtension";
import { createHelp } from "modules/help";

export default class StorageConsole extends StorageExtension {
  /**
   * 新增填充规则
   */
  public addkeep(amount: number, limit: number): string {
    this.addEnergyKeep(amount, limit);

    return "添加成功，当前设置值:\n" + this.showkeep();
  }

  /**
   * 移除填充规则
   */
  public removekeep(): string {
    this.removeEnergyKeep();

    return "移除成功，当前设置值:\n" + this.showkeep();
  }

  /**
   * 显示所有填充规则
   */
  public showkeep(): string {
    const info = this.room.memory.resourceKeepInfo;

    if (!info) return `暂无能量填充设置`;

    const logs = Object.keys(info).map(structureKey => {
      const item = info[structureKey] as IResourceKeepInfo;
      return `=> ${structureKey} 维持值: ${item.amount} 下限: ${item.limit}`;
    });

    logs.unshift("[维持值] 要在指定建筑中维持多少能量 [下限] 该设置需要 storage 中能量大于多少才会触发");

    return logs.join("\n");
  }

  /**
   * 帮助信息
   */
  public help(): string {
    return createHelp({
      name: "Storage 控制台",
      describe: "通过设置填充规则来自动向其他建筑物填充能量（目前只支持 terminal）",
      api: [
        {
          title: "添加填充规则",
          params: [
            { name: "amount", desc: `[可选] 要填充到 terminal 的能量数量，默认 ${DEFAULT_ENERGY_KEEP_AMOUNT}` },
            {
              name: "limit",
              desc: `[可选] storage 中的能量要大于该值时才会进行填充，默认 ${DEFAULT_ENERGY_KEEP_LIMIT}`
            }
          ],
          functionName: "addkeep"
        },
        {
          title: "移除填充规则",
          describe: "该操作会自动从 storage 里取出能量",
          functionName: "removekeep"
        },
        {
          title: "列出所有填充规则",
          functionName: "showkeep"
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
