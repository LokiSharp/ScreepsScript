import { OBSERVER_DEPOSIT_MAX, OBSERVER_POWERBANK_MAX } from "setting";
import ObserverExtension from "./ObserverExtension";
import colorful from "utils/colorful";
import createRoomLink from "utils/createRoomLink";

export default class ObserverConsole extends ObserverExtension {
  /**
   * 用户操作 - 查看状态
   */
  public stats(): string {
    const memory = this.room.memory.observer;
    if (!memory) return `[${this.room.name} observer] 未启用，使用 .help() 来查看更多用法`;

    const stats = [`[${this.room.name} observer] 当前状态`, this.showList()];

    // 更新旗帜列表，保证显示最新数据
    this.updateFlagList();

    // 正在采集的两种资源数量
    const pbNumber = memory.pbList.length;
    const depoNumber = memory.depoList.length;
    // 开采资源的所处房间
    const getFlagRoomLink = (flagName: string) => createRoomLink(Game.flags[flagName].pos.roomName);
    const pbPos = memory.pbList.map(getFlagRoomLink).join(" ");
    const depoPos = memory.depoList.map(getFlagRoomLink).join(" ");

    stats.push(`[powerBank] 已发现：${pbNumber}/${OBSERVER_POWERBANK_MAX} ${pbNumber ? "[位置]" : ""} ${pbPos}`);
    stats.push(`[deposit] 已发现：${depoNumber}/${OBSERVER_DEPOSIT_MAX} ${depoNumber ? "[位置]" : ""} ${depoPos}`);

    return stats.join("\n");
  }

  /**
   * 用户操作 - 新增监听房间
   *
   * @param roomNames 要进行监听的房间名称
   */
  public add(...roomNames: string[]): string {
    if (!this.room.memory.observer) this.init();

    // 确保新增的房间名不会重复
    this.room.memory.observer.watchRooms = _.uniq([...this.room.memory.observer.watchRooms, ...roomNames]);

    return `[${this.room.name} observer] 已添加，${this.showList()}`;
  }

  /**
   * 用户操作 - 移除监听房间
   *
   * @param roomNames 不在监听的房间名
   */
  public remove(...roomNames: string[]): string {
    if (!this.room.memory.observer) this.init();

    // 移除指定房间
    this.room.memory.observer.watchRooms = _.difference(this.room.memory.observer.watchRooms, roomNames);

    return `[${this.room.name} observer] 已移除，${this.showList()}`;
  }

  /**
   * 用户操作 - 暂停 observer
   */
  public off(): string {
    if (!this.room.memory.observer) return `[${this.room.name} observer] 未启用`;

    this.room.memory.observer.pause = true;

    return `[${this.room.name} observer] 已暂停`;
  }

  /**
   * 用户操作 - 重启 observer
   */
  public on(): string {
    if (!this.room.memory.observer) return `[${this.room.name} observer] 未启用`;

    delete this.room.memory.observer.pause;

    return `[${this.room.name} observer] 已恢复, ${this.showList()}`;
  }

  /**
   * 用户操作 - 清空房间列表
   */
  public clear(): string {
    if (!this.room.memory.observer) this.init();

    this.room.memory.observer.watchRooms = [];

    return `[${this.room.name} observer] 已清空监听房间`;
  }

  /**
   * 用户操作 - 显示当前监听的房间列表
   *
   * @param noTitle 该参数为 true 则不显示前缀
   */
  public showList(): string {
    const result = this.room.memory.observer
      ? `监听中的房间列表: ${this.room.memory.observer.watchRooms
          .map((room, index) => {
            if (index === this.room.memory.observer.watchIndex) return colorful(room, "green");
            else return room;
          })
          .join(" ")}`
      : `未启用`;

    return result;
  }
}
