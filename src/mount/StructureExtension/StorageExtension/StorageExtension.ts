import { DEFAULT_ENERGY_KEEP_AMOUNT, DEFAULT_ENERGY_KEEP_LIMIT } from "setting";

/**
 * Storage 拓展
 *
 * storage 会对自己中的能量进行监控，如果大于指定量（ENERGY_SHARE_LIMIT）的话
 * 就将自己注册到资源来源表中为其他房间提供能量
 */
export default class StorageExtension extends StructureStorage {
  public work(): void {
    if (Game.time % 20) return;

    this.energyKeeper();

    if (Game.time % 1000) return;
    // 定时运行规划
    this.room.releaseCreep("upgrader");
  }

  /**
   * 建筑完成时以自己为中心发布新的 creep 运维组
   */
  public onBuildComplete(): void {
    this.room.releaseCreep("harvester");
    this.room.releaseCreep("upgrader");

    this.room.sourceContainers.forEach(container => {
      // 添加从 container 到自己的能量搬运任务
      // 虽然没指定任务完成条件，但是后面 container 是会被主动摧毁的（link 造好后），这时对应的搬运任务就会被释放掉
      // 这里不指定任务完成时间的原因是在 storage 造好后 harvester 还是会用 container 好久，这个任务要一直持续到 container 消失
      this.room.transport.addTask(
        {
          type: "transport",
          from: container.id,
          to: this.id,
          resourceType: RESOURCE_ENERGY
        },
        true
      );
    });
  }

  /**
   * 将其他建筑物的能量维持在指定值
   */
  private energyKeeper() {
    const info = this.room.memory.resourceKeepInfo;
    if (!info || !info.terminal || !this.room.terminal) return;

    if (
      // terminal 能量不够了
      this.room.terminal.store[RESOURCE_ENERGY] < info.terminal.amount &&
      // 自己的能量够
      this.store[RESOURCE_ENERGY] >= info.terminal.limit
    ) {
      // 发布到 terminal 的能量转移任务
      this.room.addCenterTask({
        submit: STRUCTURE_FACTORY,
        source: STRUCTURE_STORAGE,
        target: STRUCTURE_TERMINAL,
        resourceType: RESOURCE_ENERGY,
        amount: info.terminal.amount - this.room.terminal.store[RESOURCE_ENERGY]
      });
    }
  }

  /**
   * 添加能量填充规则
   *
   * @param amount 要填充的能量数量
   * @param limit 在 storage 中能量大于多少时才会填充
   */
  public addEnergyKeep(amount: number = DEFAULT_ENERGY_KEEP_AMOUNT, limit: number = DEFAULT_ENERGY_KEEP_LIMIT): OK {
    if (!this.room.memory.resourceKeepInfo) this.room.memory.resourceKeepInfo = {};

    this.room.memory.resourceKeepInfo.terminal = { amount, limit };
    return OK;
  }

  /**
   * 移除所有能量填充规则
   */
  public removeEnergyKeep(): OK {
    delete this.room.memory.resourceKeepInfo;
    return OK;
  }
}
