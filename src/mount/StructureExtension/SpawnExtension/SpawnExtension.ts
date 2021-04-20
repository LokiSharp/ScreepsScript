/**
 * Spawn 原型拓展
 */
export default class SpawnExtension extends StructureSpawn {
  /**
   * spawn 主要工作
   */
  public onWork(): void {
    this.room.spawner.runSpawn(this);
  }
}
