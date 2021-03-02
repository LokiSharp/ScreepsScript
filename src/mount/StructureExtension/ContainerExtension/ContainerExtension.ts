/**
 * container 拓展
 *
 * 目前只有 source container，所以会在建造完成后把自己注册到对应 source 并发布对应任务
 */
export default class ContainerExtension extends StructureContainer {
  public onBuildComplete(): void {
    // 找到身边第一个没有设置 container 的 source
    const nearSource = this.pos.findInRange(FIND_SOURCES, 1, {
      filter: source => !source.getContainer()
    });
    if (nearSource[0]) nearSource[0].setContainer(this);

    if (this.room.controller.level < 1) return;
  }
}