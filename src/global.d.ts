declare namespace NodeJS {
  // 全局对象
  interface Global {
    InterShardMemory: InterShardMemory;
    // 是否已经挂载拓展
    hasExtension: boolean;
  }
}

// 本项目中出现的颜色常量
type Colors = "green" | "blue" | "yellow" | "red";

/**
 * 包含 store 属性的建筑
 */
type StructureWithStore =
  | StructureTower
  | StructureStorage
  | StructureContainer
  | StructureExtension
  | StructureFactory
  | StructureSpawn
  | StructurePowerSpawn
  | StructureLink
  | StructureTerminal
  | StructureNuker;

/**
 * 所有包含 id 字段的游戏对象
 */
interface ObjectWithId<T extends unknown = unknown> extends RoomObject {
  id: Id<T>;
}

type CenterStructures = STRUCTURE_STORAGE | STRUCTURE_TERMINAL | STRUCTURE_FACTORY | "centerLink";

interface AnyObject {
  [key: string]: any;
}
