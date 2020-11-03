import FactoryExtension from "./FactoryExtension";
import colorful from "utils/colorful";

/**
 * Factory 上的用户控制接口
 */
export default class FactoryConsole extends FactoryExtension {
  /**
   * 用户操作：设置工厂等级
   *
   * @param level 等级
   */
  public setlevel(level: 1 | 2 | 3 | 4 | 5): string {
    const result = this.setLevel(level);

    if (result === OK) return `[${this.room.name} factory] 已成功设置为 ${level} 级`;
    else if (result === ERR_INVALID_ARGS) return `[${this.room.name} factory] 设置失败，请检查参数是否正确`;
    else if (result === ERR_NAME_EXISTS) return `[${this.room.name} factory] 等级已锁定，请重建工厂后再次指定`;
    else return result;
  }

  /**
   * 用户操作 - 批量设置生产线
   *
   * @param depositTypes 要设置的生产线类型
   */
  public setchain(...depositTypes: DepositConstant[]): string {
    const result = this.setChain(...depositTypes);

    if (result === OK) {
      const log = depositTypes.length > 0 ? `已成功设置为 ${depositTypes.join(", ")} 生产线` : "已清空生产线";
      return `[${this.room.name} factory] ${log}`;
    } else if (result === ERR_INVALID_TARGET) {
      const command = colorful(`Game.rooms.${this.room.name}.factory.setlevel`, "yellow");
      const help = colorful(`Game.rooms.${this.room.name}.factory.help`, "yellow") + "()";
      return `[${this.room.name} factory] 设置失败，请先执行 ${command}, 查看 ${help} 获取更多帮助`;
    } else return result;
  }

  /**
   * 用户操作 - 移除当前工厂配置
   */
  public remove(): string {
    const actionResult = this.execRemove();

    if (actionResult === ERR_NOT_FOUND) return `[${this.room.name} factory] 尚未启用`;
    if (actionResult === OK) {
      const stopCommand = colorful(`delete Game.rooms.${this.room.name}.memory.factory.remove`, "yellow");
      return `[${this.room.name} factory] 已启动废弃进程，正在搬出所有资源，执行 ${stopCommand} 以终止进程`;
    } else return actionResult;
  }

  /**
   * 用户操作 - 输出当前工厂的状态
   */
  public stats(): string {
    if (!this.room.memory.factory) return `[${this.room.name} factory] 工厂未启用`;
    const memory = this.room.memory.factory;

    const workStats = memory.pause
      ? colorful("[暂停中]", "yellow")
      : memory.sleep
      ? colorful(`[${memory.sleepReason} 休眠中 剩余${memory.sleep - Game.time}t]`, "yellow")
      : colorful("工作中", "green");

    // 自己加入的生产线
    const joinedChain = memory.depositTypes ? memory.depositTypes.join(", ") : "未指定";

    // 工厂基本信息
    const logs = [
      `生产线类型: ${joinedChain} 工厂等级: ${memory.level || "未指定"} ${
        memory.specialTraget ? "持续生产：" + memory.specialTraget : ""
      }`,
      `生产状态: ${workStats} 当前工作阶段: ${memory.state}`,
      `现存任务数量: ${memory.taskList.length} 任务队列详情:`
    ];

    // 工厂任务队列详情
    if (memory.taskList.length <= 0) logs.push("无任务");
    else
      logs.push(
        ...memory.taskList.map((task, index) => `  - [任务 ${index}] 任务目标: ${task.target} 任务数量: ${task.amount}`)
      );

    // 组装返回
    return logs.join("\n");
  }

  /**
   * 用户操作：暂停 factory
   */
  public off(): string {
    if (!this.room.memory.factory) return `[${this.room.name} factory] 未启用`;
    this.room.memory.factory.pause = true;
    return `[${this.room.name} factory] 已暂停`;
  }

  /**
   * 用户操作：重启 factory
   * 会同时将工厂从停工中唤醒
   */
  public on(): string {
    if (!this.room.memory.factory) return `[${this.room.name} factory] 未启用`;
    delete this.room.memory.factory.pause;
    this.wakeup();
    return `[${this.room.name} factory] 已恢复, 当前状态：${this.stats()}`;
  }

  /**
   * 用户操作：手动指定生产目标
   *
   * @param target 要生产的目标
   * @param clear 是否同时清理工厂之前的合成任务
   */
  public set(target: CommodityConstant, clear = true): string {
    if (!this.room.memory.factory) this.initMemory();
    this.room.memory.factory.specialTraget = target;
    // 让工厂从暂停中恢复
    delete this.room.memory.factory.pause;
    // 清理残留任务
    if (clear) this.clearTask();
    return `[${this.room.name} factory] 目标已锁定为 ${target}，将会持续生成，${
      clear ? "遗留任务已被清空" : "遗留任务未清空，可能会堵塞队列"
    }`;
  }

  /**
   * 用户操作 - 清除上面设置的特定目标
   * 如果之前设置过工厂状态的话（setlevel），将会恢复到对应的自动生产状态
   */
  public clear(): string {
    if (!this.room.memory.factory) return `[${this.room.name} factory] 未启用`;
    const logs = [
      `[${this.room.name} factory] 已移除目标 ${this.room.memory.factory.specialTraget}，开始托管生产。当前生产状态：`
    ];
    delete this.room.memory.factory.specialTraget;
    logs.push(this.stats());

    return logs.join("\n");
  }

  /**
   * 危险 - 清空当前任务队列
   */
  public clearTask(): void {
    this.room.memory.factory.taskList = [];
  }
}
