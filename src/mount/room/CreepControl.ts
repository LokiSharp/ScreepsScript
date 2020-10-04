import RoomConsole from "./RoomConsole";
import { creepApi } from "modules/creepController";
import { releaseCreep } from "modules/autoPlanning/planCreep";

export default class CreepControl extends RoomConsole {
  /**
   * 给本房间发布或重新规划指定的 creep 角色
   * @param role 要发布的 creep 角色
   */
  public releaseCreep(role: BaseRoleConstant): ScreepsReturnCode {
    return releaseCreep(this, role);
  }

  /**
   * 发布外矿角色组
   *
   * @param remoteRoomName 要发布 creep 的外矿房间
   */
  public addRemoteCreepGroup(remoteRoomName: string): void {
    this.addRemoteReserver(remoteRoomName);
  }

  /**
   * 发布房间预定者
   *
   * @param remoteRoomName 要预定的外矿房间名
   * @param single 为 false 时将允许为一个房间发布多个预定者，为 true 时可以执行自动发布
   */
  public addRemoteReserver(remoteRoomName: string, single = true): void {
    // 添加外矿预定者
    const reserverName = `${remoteRoomName} reserver${single ? "" : Game.time}`;
    if (!creepApi.has(reserverName))
      creepApi.add(
        reserverName,
        "reserver",
        {
          targetRoomName: remoteRoomName
        },
        this.name
      );
  }
}
