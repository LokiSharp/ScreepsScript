/**
 * Room 控制台交互
 *
 * 本文件包含了 Room 中用于控制台交互的方法
 */
import RoomExtension from "./RoomExtension";
import { getName } from "utils/getName";
import { planLayout } from "modules/autoPlanning/planBaseLayout";
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
    planLayout(this);
    return `[${this.name}] 已将 ${flagName} 设置为中心点，controller 升级时自动执行布局规划`;
  }
}
