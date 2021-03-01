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
 * creep 能从中获取能量的建筑
 */
type EnergySourceStructure = StructureLink | StructureContainer | StructureTerminal | StructureStorage;

/**
 * 所有能量来源
 *
 * creep 将会从这些地方获取能量
 */
type AllEnergySource = Source | EnergySourceStructure | Ruin | Resource<RESOURCE_ENERGY>;

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

type CenterStructures = STRUCTURE_STORAGE | STRUCTURE_TERMINAL | STRUCTURE_FACTORY | "centerLink";

interface AnyObject {
  [key: string]: any;
}
