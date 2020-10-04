/**
 * Room 控制台交互
 *
 * 本文件包含了 Room 中用于控制台交互的方法
 */
import RoomExtension from "./RoomExtension";

export default class RoomConsole extends RoomExtension {
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
}
