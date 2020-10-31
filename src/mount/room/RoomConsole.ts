/**
 * Room 控制台交互
 *
 * 本文件包含了 Room 中用于控制台交互的方法
 */
import { LAB_STATE, labTarget } from "setting";
import RoomExtension from "./RoomExtension";
import colorful from "utils/colorful";
import { getName } from "utils/getName";
import { manageStructure } from "modules/autoPlanning";
import { setBaseCenter } from "modules/autoPlanning/planBasePos";

export default class RoomConsole extends RoomExtension {
  /**
   * 用户操作 - 执行自动建筑规划
   */
  public planlayout(): string {
    return this.planLayout();
  }

  /**
   * 用户操作 - 拓展新外矿
   *
   */
  public radd(remoteRoomName: string, targetId: string): string {
    let stats = `[${this.name} 外矿] `;

    const actionResult = this.addRemote(remoteRoomName, targetId);
    if (actionResult === OK) stats += "拓展完成，已发布 remoteHarvester 及 reserver";
    else if (actionResult === ERR_INVALID_TARGET) stats += "拓展失败，无效的 targetId";
    else if (actionResult === ERR_NOT_FOUND)
      stats += `拓展失败，未找到 source 旗帜，请在外矿房间的 source 上放置名为 [${remoteRoomName} source0] 的旗帜（有多个 source 请依次增加旗帜名最后一位的编号）`;

    return stats;
  }

  /**
   * 用户操作 - 移除外矿
   *
   * @param 同上 removeRemote()
   */
  public rremove(remoteRoomName: string, removeFlag = false): string {
    let stats = `[${this.name} 外矿] `;

    const actionResult = this.removeRemote(remoteRoomName, removeFlag);
    if (actionResult === OK)
      stats += "外矿及对应角色组已移除，" + (removeFlag ? "source 旗帜也被移除" : "source 旗帜未移除");
    else if (actionResult === ERR_NOT_FOUND) stats += "未找到对应外矿";

    return stats;
  }

  /**
   * 用户操作 - 占领新房间
   *
   * @param 同上 claimRoom()
   */
  public claim(targetRoomName: string, signText = ""): string {
    this.claimRoom(targetRoomName, signText);

    return `[${
      this.name
    } 拓展] 已发布 claimer，请保持关注，支援单位会在占领成功后自动发布。\n 你可以在目标房间中新建名为 ${getName.flagBaseCenter(
      targetRoomName
    )} 的旗帜来指定基地中心。否则 claimer 将运行自动规划。`;
  }

  /**
   * 用户操作 - 设置中心点
   * @param flagName 中心点旗帜名
   */
  public setcenter(flagName: string): string {
    if (!flagName) flagName = getName.flagBaseCenter(this.name);
    const flag = Game.flags[flagName];

    if (!flag) return `[${this.name}] 未找到名为 ${flagName} 的旗帜`;

    setBaseCenter(this, flag.pos);
    flag.remove();
    // 设置好了之后自动运行布局规划
    manageStructure(this);
    return `[${this.name}] 已将 ${flagName} 设置为中心点，controller 升级时自动执行布局规划`;
  }

  /**
   * 用户操作：初始化 lab 集群
   * 要提前放好名字为 lab1 和 lab2 的两个旗帜（放在集群中间的两个 lab 上）
   */
  public linit(): string {
    /**
     * 获取旗帜及兜底
     * @danger 这里包含魔法常量，若有需要应改写成数组形式
     */
    const lab1Flag = Game.flags.lab1;
    const lab2Flag = Game.flags.lab2;
    if (!lab1Flag || !lab2Flag) return `[lab 集群] 初始化失败，请新建名为 [lab1] 和 [lab2] 的旗帜`;
    if (lab1Flag.pos.roomName !== this.name || lab2Flag.pos.roomName !== this.name)
      return `[lab 集群] 初始化失败，旗帜不在本房间内，请进行检查`;

    // 初始化内存, 之前有就刷新 id 缓存，没有就新建
    if (this.memory.lab) {
      this.memory.lab.inLab = [];
      this.memory.lab.outLab = {};
    } else {
      this.memory.lab = {
        state: "getTarget",
        targetIndex: 1,
        inLab: [],
        outLab: {},
        pause: false
      };
    }

    // 获取并分配 lab
    const labs = this.find(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_LAB
    });
    labs.forEach(lab => {
      if (lab.pos.isEqualTo(lab1Flag.pos) || lab.pos.isEqualTo(lab2Flag.pos)) this.memory.lab.inLab.push(lab.id);
      else this.memory.lab.outLab[lab.id] = 0;
    });

    lab1Flag.remove();
    lab2Flag.remove();

    return `[${this.name} lab] 初始化成功`;
  }

  /**
   * 用户操作：暂停 lab 集群
   */
  public loff(): string {
    if (!this.memory.lab) return `[${this.name} lab] 集群尚未初始化`;
    this.memory.lab.pause = true;
    return `[${this.name} lab] 已暂停工作`;
  }

  /**
   * 用户操作：重启 lab 集群
   */
  public lon(): string {
    if (!this.memory.lab) return `[${this.name} lab] 集群尚未初始化`;
    this.memory.lab.pause = false;
    return `[${this.name} lab] 已恢复工作`;
  }

  /**
   * 用户操作：显示当前 lab 状态
   */
  public lshow(): string {
    const memory = this.memory.lab;
    if (!memory) return `[${this.name}] 未启用 lab 集群`;
    const logs = [`[${this.name}]`];

    if (memory.pause) logs.push(colorful("暂停中", "yellow"));
    logs.push(`[状态] ${memory.state}`);

    // 获取当前目标产物以及 terminal 中的数量
    const res = labTarget[memory.targetIndex];
    const currentAmount = this.terminal ? this.terminal.store[res.target] : colorful("无法访问 terminal", "red");

    // 在工作就显示工作状态
    if (memory.state === LAB_STATE.WORKING) {
      logs.push(
        `[工作进程] 目标 ${res.target} 剩余生产/当前存量/目标存量 ${memory.targetAmount}/${currentAmount}/${res.targetNumber}`
      );
    }
    // 做完了就显示总数
    else if (memory.state === LAB_STATE.PUT_RESOURCE) {
      logs.push(`正在将 ${res.target} 转移至 terminal，数量：${Object.values(memory.outLab).reduce((p, n) => p + n)}`);
    }

    return logs.join(" ");
  }

  /**
   * 用户操作 - 启动战争状态
   */
  public war(): string {
    let stats = `[${this.name}] `;
    const result = this.startWar("WAR");

    if (result === OK) stats += `已启动战争状态，正在准备 boost 材料，请在准备完成后再发布角色组`;
    else if (result === ERR_NAME_EXISTS) stats += "已处于战争状态";
    else if (result === ERR_NOT_FOUND)
      stats += `未找到名为 [${this.name}Boost] 的旗帜，请保证其周围有足够数量的 lab（至少 6 个）`;
    else if (result === ERR_INVALID_TARGET) stats += "旗帜周围的 lab 数量不足，请移动旗帜位置";

    return stats;
  }

  /**
   * 用户操作 - 取消战争状态
   */
  public nowar(): string {
    let stats = `[${this.name}] `;
    const result = this.stopWar();

    if (result === OK) stats += `已解除战争状态，boost 强化材料会依次运回 Terminal`;
    else if (result === ERR_NOT_FOUND) stats += `未启动战争状态`;

    return stats;
  }
}
