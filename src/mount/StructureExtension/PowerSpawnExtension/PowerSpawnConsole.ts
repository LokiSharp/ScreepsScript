import PowerSpawnExtension from "./PowerSpawnExtension";
import colorful from "@/utils/console/colorful";
import createRoomLink from "@/utils/console/createRoomLink";

export default class PowerSpawnConsole extends PowerSpawnExtension {
  /**
   * 用户操作 - 启动 powerSpawn
   * 虽然默认情况下 ps 就是会自动消化 power 的，但是执行了本方法之后，本 ps 就可以从其他房间中自动的调配 power 进行消化。
   */
  public on(): string {
    delete this.room.memory.pausePS;

    // 把自己注册到全局的启用 ps 列表
    if (!Memory.psRooms) Memory.psRooms = [];
    Memory.psRooms = _.uniq([...Memory.psRooms, this.room.name]);

    return `[${this.room.name} PowerSpawn] 已启动 process power`;
  }

  /**
   * 用户操作 - 关闭 powerSpawn
   */
  public off(): string {
    this.room.memory.pausePS = true;

    // 把自己从全局启用 ps 列表中移除
    if (Memory.psRooms) {
      Memory.psRooms = _.difference(Memory.psRooms, [this.room.name]);
      if (Memory.psRooms.length <= 0) delete Memory.psRooms;
    }

    return `[${this.room.name} PowerSpawn] 已暂停 process power`;
  }

  /**
   * 用户操作 - 查看 ps 运行状态
   */
  public stats(): string {
    const stats: string[] = [];
    // 生成状态
    const working = this.store[RESOURCE_POWER] > 1 && this.store[RESOURCE_ENERGY] > 50;
    const prefix = [
      colorful("●", working ? "green" : "yellow", true),
      createRoomLink(this.room.name),
      colorful(working ? "工作中" : "等待资源中", working ? "green" : "yellow")
    ].join(" ");

    // 统计 powerSpawn、storage、terminal 的状态
    stats.push(
      `${prefix} POWER: ${this.store[RESOURCE_POWER]}/${POWER_SPAWN_POWER_CAPACITY} ENERGY: ${this.store[RESOURCE_ENERGY]}/${POWER_SPAWN_ENERGY_CAPACITY}`
    );
    stats.push(this.room.storage ? `Storage energy: ${this.room.storage.store[RESOURCE_ENERGY]}` : `Storage X`);
    stats.push(this.room.terminal ? `Terminal power: ${this.room.terminal.store[RESOURCE_POWER]}` : `Terminal X`);

    return stats.join(" || ");
  }
}
