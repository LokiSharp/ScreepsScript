/**
 * 所有 creep 角色的 data
 */
type CreepData =
  | EmptyData
  | HarvesterData
  | WorkerData
  | RemoteDeclarerData
  | RemoteHarvesterData
  | ProcessorData
  | ReiverData
  | WarUnitData
  | HealUnitData
  | pbAttackerData;

/**
 * 有些角色不需要 data
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EmptyData {}
/**
 * 采集单位的 data
 * 执行从 sourceId 处采集东西，并转移至 targetId 处（不一定使用，每个角色都有自己固定的目标例如 storage 或者 terminal）
 */
interface HarvesterData {
  // 要采集的 source id
  sourceId: Id<Source>;
  // 把采集到的资源存到哪里存在哪里
  targetId: Id<EnergySourceStructure>;
}
/**
 * 工作单位的 data
 * 由于由确定的工作目标所以不需要 targetId
 */
interface WorkerData {
  // 要使用的资源存放建筑 id
  sourceId: Id<EnergySourceStructure>;
}
/**
 * 中央运输者的 data
 * x y 为其在房间中的固定位置
 */
interface ProcessorData {
  x: number;
  y: number;
}
/**
 * 远程声明单位的 data
 * 这些单位都会和目标房间的 controller 打交道
 */
interface RemoteDeclarerData {
  // 要声明控制的房间名
  targetRoomName: string;
  // 自己出生的房间，claim 需要这个字段来向老家发布支援 creep
  spawnRoom?: string;
  // 给控制器的签名
  signText?: string;
  wayPoint?: string;
  keepSpawn?: boolean;
  logPrePos?: boolean;
}
/**
 * 远程采集单位的 data
 * 包括外矿采集和公路房资源采集单位
 */
interface RemoteHarvesterData {
  // 要采集的资源旗帜名称
  sourceFlagName: string;
  // 资源要存放到哪个建筑里，外矿采集者必须指定该参数
  targetId?: Id<StructureWithStore>;
  // 出生房名称，资源会被运输到该房间中
  spawnRoom?: string;
}
interface pbAttackerData {
  // 要采集的资源旗帜名称
  sourceFlagName: string;
  // 资源要存放到哪个建筑里，外矿采集者必须指定该参数
  healerCreepName: string;
  // 出生房名称，资源会被运输到该房间中
  spawnRoom: string;
}
/**
 * 掠夺者单位的 ddata
 */
interface ReiverData {
  // 目标建筑上的旗帜名称
  flagName: string;
  // 要搬运到的建筑 id
  targetId: Id<StructureWithStore>;
}
/**
 * 战斗单位的 data
 */
interface WarUnitData {
  // 要攻击的旗帜名
  targetFlagName: string;
  // 其治疗者名称，战斗单位会尽量保持该单位和自己相邻
  healerName?: string;
  // 待命位置旗帜名
  // standByFlagName: string
  // 是否持续孵化
  keepSpawn: boolean;
  wayPoint?: string;
}

/**
 * 治疗单位的 data
 */
interface HealUnitData {
  // 要治疗的旗帜名
  creepName: string;
  // 待命位置旗帜名
  standByFlagName?: string;
  // 是否持续孵化
  keepSpawn?: boolean;
  wayPoint?: string;
}

/**
 * 一体机战斗单位的 data
 */
interface RangedAttackerData {
  // 要攻击的旗帜名
  targetFlagName: string;
  // 抗几个塔的伤害，由这个参数决定其身体部件组成
  bearTowerNum: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  // 是否持续孵化
  keepSpawn: boolean;
  wayPoint?: string;
}
