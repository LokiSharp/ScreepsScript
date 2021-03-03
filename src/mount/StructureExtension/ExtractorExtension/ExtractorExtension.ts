/**
 * Extractor 拓展
 *
 * 在刚刚建成时会在房间内存里写入 mineral 的 id
 * 并在资源来源表里注册自己
 */
export default class ExtractorExtension extends StructureExtractor {
  public onBuildComplete(): void {
    // 如果终端造好了就发布挖矿任务
    if (this.room.terminal) this.room.work.updateTask({ type: "mine", need: 1, priority: 0 });
  }
}
