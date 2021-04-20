// Link 原型拓展
export default class LinkExtension extends StructureLink {
  /**
   * link 主要工作
   */
  public onWork(): void {
    // 冷却好了再执行
    if (this.cooldown !== 0) return;

    // 检查内存字段来决定要执行哪种职责的工作
    if (this.room.memory.centerLinkId && this.room.memory.centerLinkId === this.id) this.centerWork();
    else if (this.room.memory.upgradeLinkId && this.room.memory.upgradeLinkId === this.id) this.upgradeWork();
    else this.sourceWork();
  }

  /**
   * 回调 - 建造完成
   * 分配默认职责，玩家不同意默认职责的话也可以手动调用 .as... 方法重新分配职责
   */
  public onBuildComplete(): void {
    // 如果附近有 controller 就转换为 UpgradeLink
    if (this.room.controller.pos.inRangeTo(this, 2)) {
      this.asUpgrade();
      return;
    }

    // 在基地中心附近就转换为 CenterLink
    const center = this.room.memory.center;
    if (center && this.pos.isNearTo(new RoomPosition(center[0], center[1], this.room.name))) {
      this.asCenter();
      return;
    }

    // 否则就默认转换为 SourceLink（因为有外矿 link，而这种 link 边上是没有 source 的）
    this.asSource();
  }

  /**
   * 注册为源 link
   */
  public asSource(): string {
    this.clearRegister();

    // 找到身边第一个没有设置 link 的 source，并把自己绑定上去
    const nearSource = this.pos.findInRange(FIND_SOURCES, 2, {
      filter: source => !source.getLink()
    });
    if (nearSource[0]) nearSource[0].setLink(this);

    return `${this.id} 已注册为源 link，已重定向对应 harvester 的存放目标`;
  }

  /**
   * 注册为中央 link
   */
  public asCenter(): string {
    this.clearRegister();
    this.room.memory.centerLinkId = this.id;

    // 注册中央 link 的同时发布 processor
    this.room.spawner.release.processor();

    return `${this.id} 已注册为中央 link，发布 processor 并调整采集单位`;
  }

  /**
   * 注册为升级 link
   *
   * 自己被动的给 upgrader 角色提供能量，所以啥也不做
   * 只是在房间内存里注册来方便其他 link 找到自己
   */
  public asUpgrade(): string {
    this.clearRegister();

    this.room.memory.upgradeLinkId = this.id;
    return `${this.id} 已注册为升级 link`;
  }

  /**
   * 每次使用三个 as 时都要调用
   * 防止同时拥有多个角色
   */
  private clearRegister() {
    if (this.room.memory.centerLinkId === this.id) delete this.room.memory.centerLinkId;
    if (this.room.memory.upgradeLinkId === this.id) delete this.room.memory.upgradeLinkId;
  }

  /**
   * 扮演升级 link
   *
   * 自己能量不足时检查 storage 和 terminal 里的能量，并发布中央物流
   */
  private upgradeWork(): void {
    // 有能量就待机
    if (this.store[RESOURCE_ENERGY] > 100) return;
    const centerlink = this.room.centerLink;
    // 中央 link 没冷却好，待机
    if (!centerlink || centerlink.cooldown > 0) return;

    /**
     * 当 RCL 小于 7 时，房间只支持 3 个 link，这时存在 upgradeLink 的话就导致房间内存在 4 个 Link（1 个 center、2 个 source）
     * 这就导致了这四个 link 中势必会有一个 link 不能工作，如果这个 link 恰好是 centerLink 的话，整个房间运营就会卡死。
     * 所以，在不够 7 级时应该主动移除 upgradeLink。
     *
     * 这种情况只会在房间从 7 级以上掉级下来时出现
     */
    if (this.room.controller.level < 7) this.destroy();

    let source: StructureTerminal | StructureStorage;
    // 优先用 terminal 里的能量
    if (this.room.terminal && this.room.terminal.store[RESOURCE_ENERGY] > LINK_CAPACITY) source = this.room.terminal;
    // terminal 不能作为能量来源的话就用 storage 里的能量
    if (!source && this.room.storage && this.room.storage.store[RESOURCE_ENERGY] > LINK_CAPACITY)
      source = this.room.storage;
    // 实在找不到目标了，放弃治疗
    if (!source) return;

    // 以 centerLink 的名义发布中央物流任务
    this.room.centerTransport.addTask({
      submit: "centerLink",
      source: source.structureType,
      target: "centerLink",
      resourceType: RESOURCE_ENERGY,
      // 自己和 centerLink 的容量中找最小值
      amount: Math.min(this.store.getFreeCapacity(RESOURCE_ENERGY), centerlink.store.getFreeCapacity(RESOURCE_ENERGY))
    });
  }

  /**
   * 扮演中央 link
   *
   * 能量快满时向房间中的资源转移队列推送任务
   */
  private centerWork(): void {
    // 能量不足则待机
    if (this.store[RESOURCE_ENERGY] < 600) return;

    // 优先响应 upgrade
    if (this.supportUpgradeLink()) return;

    // 之前发的转移任务没有处理好的话就先挂机
    if (this.room.centerTransport.hasTask("centerLink") || !this.room.storage) return;

    this.room.centerTransport.addTask({
      submit: "centerLink",
      source: "centerLink",
      target: STRUCTURE_STORAGE,
      resourceType: RESOURCE_ENERGY,
      amount: this.store[RESOURCE_ENERGY]
    });
  }

  /**
   * 扮演能量提供 link
   *
   * 如果房间内有 upgrede link 并且其没有能量时则把自己的能量转移给它
   * 否则向中央 link 发送能量
   * 都不存在时待机
   */
  private sourceWork(): void {
    // 能量填满再发送
    if (this.store.getUsedCapacity(RESOURCE_ENERGY) < 700) return;

    if (this.room.controller?.progressTotal && this.room.storage?.store?.energy > 500000 && this.supportUpgradeLink())
      return;

    // 发送给 center link
    if (this.room.memory.centerLinkId) {
      const centerLink = this.getLinkByMemoryKey("centerLinkId");
      if (!centerLink || centerLink.store[RESOURCE_ENERGY] >= 799) return;

      this.transferEnergy(centerLink);
    }
  }

  /**
   * 把能量发送给升级 Link
   * @returns 是否进行了发送
   */
  private supportUpgradeLink(): boolean {
    if (this.room.memory.upgradeLinkId) {
      const upgradeLink = this.getLinkByMemoryKey("upgradeLinkId");
      // 如果 upgrade link 没能量了就转发给它
      if (upgradeLink && upgradeLink.store[RESOURCE_ENERGY] <= 100) {
        this.transferEnergy(upgradeLink);
        return true;
      }
    }

    return false;
  }

  /**
   * 通过 room.memory 中指定字段名中的值获取 link
   * 如果没有找到对应的 link id 的话则清除该字段
   * @danger 请不要把该方法用在查找 link 之外的地方
   *
   * @param memoryKey link 的 id 保存在哪个 room.memory 字段中
   */
  private getLinkByMemoryKey(memoryKey: string): StructureLink | null {
    const linkId = this.room.memory[memoryKey] as Id<StructureLink>;
    if (!linkId) return null;
    const link: StructureLink = Game.getObjectById(linkId);
    // 不存在说明 link 已经被摧毁了 清理并退出
    if (!link) {
      delete this.room.memory[memoryKey];
      return null;
    } else return link;
  }
}
