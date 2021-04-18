import { setRoomStats } from "@/modules/stats";

// Nuker 拓展
export default class NukerExtension extends StructureNuker {
  public onWork(): void {
    this.stateScanner();

    if (Game.time % 30) return;

    // 能量不满并且 storage 能量大于 300k 则开始填充能量
    if (!this.keepResource(RESOURCE_ENERGY, NUKER_ENERGY_CAPACITY, this.room.storage, 300000)) return;
    // G 矿不满并且 terminal 中有 G 矿则开始填充 G
    if (!this.keepResource(RESOURCE_GHODIUM, NUKER_GHODIUM_CAPACITY, this.room.terminal, 0)) return;
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
    if (source && source.store.getUsedCapacity(resource) > sourceLimit && !this.room.transport.hasTask("fillNuker")) {
      this.room.transport.addTask({
        type: "fillNuker",
        id: this.id,
        resourceType: resource,
        priority: 0
      });
    }

    return false;
  }

  /**
   * 统计自己存储中的资源数量
   */
  private stateScanner(): void {
    setRoomStats(this.room.name, () => ({
      nukerEnergy: this.store[RESOURCE_ENERGY],
      nukerG: this.store[RESOURCE_GHODIUM],
      nukerCooldown: this.cooldown
    }));
  }
}
