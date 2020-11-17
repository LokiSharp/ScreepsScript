// 当 creep 不需要生成时 mySpawnCreep 返回的值
type CREEP_DONT_NEED_SPAWN = -101;
// spawn.mySpawnCreep 方法的返回值集合
type MySpawnReturnCode = ScreepsReturnCode | CREEP_DONT_NEED_SPAWN;

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
type AllEnergySource = Source | EnergySourceStructure;

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

/**
 * 目前存在的所有有效 RCL 等级
 */
type AvailableLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
