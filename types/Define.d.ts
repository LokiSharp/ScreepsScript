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

interface AnyObject {
  [key: string]: any;
}

/**
 * 所有被添加到 Room 上的快捷访问键
 */
type AllRoomShortcut =
  | STRUCTURE_OBSERVER
  | STRUCTURE_POWER_SPAWN
  | STRUCTURE_EXTRACTOR
  | STRUCTURE_NUKER
  | STRUCTURE_FACTORY
  | STRUCTURE_SPAWN
  | STRUCTURE_EXTENSION
  | STRUCTURE_ROAD
  | STRUCTURE_WALL
  | STRUCTURE_RAMPART
  | STRUCTURE_KEEPER_LAIR
  | STRUCTURE_PORTAL
  | STRUCTURE_LINK
  | STRUCTURE_TOWER
  | STRUCTURE_LAB
  | STRUCTURE_CONTAINER
  | "mineral"
  | "source";
/**
 * 房间快捷访问的 id 缓存
 */
interface StructureIdCache {
  /**
   * 每个房间的建筑 id 合集
   */
  [roomName: string]: {
    /**
     * 每个建筑类型对应的 id 数组
     * 这里不考虑建筑是单个还是多个，统一都是数组
     */
    [T in AllRoomShortcut]?: Id<RoomObject>[];
  };
}
