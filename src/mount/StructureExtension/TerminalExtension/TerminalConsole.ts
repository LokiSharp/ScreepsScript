import { terminalChannels, terminalModes } from "@/setting";
import TerminalExtension from "./TerminalExtension";
import colorful from "@/utils/console/colorful";

/**
 * Terminal 上的用户控制接口
 */
export default class TerminalConsole extends TerminalExtension {
  /**
   * 用户操作 - 添加资源监听
   */
  public add(
    resourceType: ResourceConstant,
    amount: number,
    mod: TerminalModes = 0,
    channel: TerminalChannels = 0,
    priceLimit: number = undefined,
    supportRoomName: string = undefined
  ): string {
    if (!_.isNumber(priceLimit)) priceLimit = undefined;
    if (!_.isString(supportRoomName)) supportRoomName = undefined;

    this.addTask(resourceType, amount, mod, channel, priceLimit, supportRoomName);
    return `已添加，当前监听任务如下: \n${this.show()}`;
  }

  /**
   * 用户操作 - 移除资源监听任务
   */
  public remove(index: number): string {
    this.removeTask(index);
    return `已移除，当前监听任务如下:\n${this.show()}`;
  }

  /**
   * 用户操作：将终端监听设置为默认值
   *
   * @param hard 设为 true 来移除其默认值中不包含的监听资源
   */
  public reset(hard = false): string {
    if (hard) this.room.memory.terminalTasks = [];
    this.room.memory.terminalIndex = 0;

    // 要添加的默认资源
    const defaultResource = [
      RESOURCE_OXYGEN,
      RESOURCE_HYDROGEN,
      RESOURCE_KEANIUM,
      RESOURCE_LEMERGIUM,
      RESOURCE_UTRIUM,
      RESOURCE_ZYNTHIUM,
      RESOURCE_CATALYST
    ];

    // 默认选项为从资源共享协议获取所有的基础元素各 5000
    defaultResource.forEach(res => this.addTask(res, 5000, terminalModes.get, terminalChannels.share));

    // 在本房间产出的元素超过 10000 时，从资源共享协议发送，超过 100000 时拍单贩卖
    this.addTask(this.room.mineral.mineralType, 10000, terminalModes.put, terminalChannels.share);
    this.addTask(this.room.mineral.mineralType, 100000, terminalModes.put, terminalChannels.take);

    // 在本房间产出的 OPS 超过 10000 时拍单贩卖
    this.addTask(RESOURCE_OPS, 10000, terminalModes.put, terminalChannels.take);

    return `已重置，当前监听任务如下:\n${this.show()}`;
  }

  /**
   * 显示所有终端监听任务
   */
  public show(): string {
    if (!this.room.memory.terminalTasks) return "该房间暂无终端监听任务";

    const tasks = this.room.memory.terminalTasks;
    const currentIndex = this.room.memory.terminalIndex;

    // 从 code 转换为介绍，提高可读性
    const channelIntroduce: { [action in TerminalChannels]: string } = {
      [terminalChannels.take]: "拍单",
      [terminalChannels.release]: "挂单",
      [terminalChannels.share]: "共享",
      [terminalChannels.support]: "支援"
    };
    const modeIntroduce: { [action in TerminalModes]: string } = {
      [terminalModes.get]: "get",
      [terminalModes.put]: "put"
    };

    // 遍历所有任务绘制结果
    return tasks
      .map((taskStr, index) => {
        const task = this.unstringifyTask(taskStr);
        const logs = [
          `[${index}] ${colorful(task.type, "blue")}`,
          `[当前/期望] ${this.room.terminal.store[task.type]}/${task.amount}`,
          `[类型] ${modeIntroduce[task.mod]}`,
          `[渠道] ${channelIntroduce[task.channel]}`
        ];
        if (task.priceLimit) logs.push(`[价格${task.mod === terminalModes.get ? "上限" : "下限"}] ${task.priceLimit}`);
        if (task.supportRoomName) logs.push(`[支援目标] ${task.supportRoomName}`);
        if (index === currentIndex) logs.push(`< 正在检查`);
        return "  " + logs.join(" ");
      })
      .join("\n");
  }
}
