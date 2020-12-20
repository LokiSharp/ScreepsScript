import { powerSettings } from "setting";

/**
 * PowerSpawn 拓展
 * ps 的主要任务就是 processPower，一旦 ps 启动之后，他会每隔一段时间对自己存储进行检查
 * 发现自己资源不足，就会发起向自己运输资源的物流任务。
 *
 * 可以随时通过原型上的指定方法来暂停/重启 ps，详见 .help()
 */
export default class PowerSpawnExtension extends StructurePowerSpawn {
  public work(): void {
    // ps 未启用或者被暂停了就跳过
    if (this.room.memory.pausePS) return;

    // 处理 power
    this.processPower();

    // 剩余 power 不足且 terminal 内 power 充足
    if (!this.keepResource(RESOURCE_POWER, 10, this.room.terminal, 0)) return;
    // 剩余energy 不足且 storage 内 energy 充足
    if (!this.keepResource(RESOURCE_ENERGY, 1000, this.room.storage, powerSettings.processEnergyLimit)) return;
  }

  /**
   * 将自身存储的资源维持在指定容量之上
   *
   * @param resource 要检查的资源
   * @param amount 当资源余量少于该值时会发布搬运任务
   * @param source 资源不足时从哪里获取资源
   * @param sourceLimit 资源来源建筑中剩余目标资源最小值（低于该值将不会发布资源获取任务）
   * @returns 该资源是否足够
   */
  private keepResource(
    resource: ResourceConstant,
    amount: number,
    source: StructureStorage | StructureTerminal,
    sourceLimit: number
  ): boolean {
    if (this.store[resource] >= amount) return true;

    // 检查来源是否符合规则，符合则发布资源转移任务
    if (source && source.store.getUsedCapacity(resource) > sourceLimit) {
      this.room.transport.addTask({
        type: "fillPowerSpawn",
        id: this.id,
        resourceType: resource
      });
    }

    return false;
  }
}
