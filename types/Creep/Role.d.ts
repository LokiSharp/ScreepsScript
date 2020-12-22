/**
 * 所有的 creep 角色
 */
type CreepRoleConstant = keyof RoleDatas;

/**
 * 所有 creep 角色的 data
 */
type CreepData = RoleDatas[CreepRoleConstant];

interface RoleDatas {
  /**
   * 房间基础运营
   */
  harvester: HarvesterData;
  collector: HarvesterData;
  miner: MinerData;
  upgrader: WorkerData;
  builder: WorkerData;
  repairer: WorkerData;

  /**
   * 房间高级运营
   */
  manager: TransporterData;
  processor: ProcessorData;

  /**
   * 外派单位
   */
  claimer: RemoteDeclarerData;
  reserver: RemoteDeclarerData;
  signer: RemoteDeclarerData;
  remoteBuilder: RemoteHelperData;
  remoteUpgrader: RemoteHelperData;
  remoteHarvester: RemoteHarvesterData;
  depositHarvester: RemoteHarvesterData;
  pbAttacker: pbAttackerData;
  pbHealer: HealUnitData;
  pbCarrier: RemoteHarvesterData;
  moveTester: RemoteDeclarerData;
  reiver: ReiverData;
  buildHelper: RemoteDeclarerData;

  /**
   * 战斗单位
   */
  attacker: WarUnitData;
  healer: HealUnitData;
  boostHealer: HealUnitData;
  boostAttacker: WarUnitData;
  dismantler: WarUnitData;
  boostDismantler: WarUnitData;
  rangedAttacker: RangedAttackerData;
  boostRangedAttacker: RangedAttackerData;
  defender: EmptyData;
}

/**
 * creep 工作逻辑集合
 * 包含了每个角色应该做的工作
 */
type CreepWork = {
  [role in CreepRoleConstant]: CreepConfig<role>;
};

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
  targetId?: Id<EnergySourceStructure>;
}

/**
 * 矿工 data
 */
interface MinerData {
  /**
   * 要采集的 mineral id
   */
  sourceId: Id<Mineral>;
  /**
   * 把采集到的资源存到哪里存在哪里
   */
  targetId?: Id<EnergySourceStructure>;
}

/**
 * 工作单位的 data
 * 由于由确定的工作目标所以不需要 targetId
 */
interface WorkerData {
  /**
   * 要使用的资源存放建筑 id
   */
  sourceId?: Id<EnergySourceStructure>;
  /**
   * 该 creep 的工作房间
   * 例如一个外矿搬运者需要知道自己的老家在哪里
   */
  workRoom: string;
}

/**
 * 运输单位的 data
 */
interface TransporterData {
  /**
   * 要使用的资源存放建筑 id
   */
  sourceId?: Id<StructureWithStore>;
  /**
   * 该 creep 的工作房间
   * 例如一个外矿搬运者需要知道自己的老家在哪里
   */
  workRoom: string;
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

/**
 * 远程协助单位的 data
 */
interface RemoteHelperData {
  // 要支援的房间名
  targetRoomName: string;
  // 该房间中的能量来源
  sourceId: Id<Source | StructureContainer | StructureStorage | StructureTerminal>;
  // 出生房名称，资源会被运输到该房间中
  spawnRoom?: string;
  wayPoint?: string;
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
  bearTowerNum?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  // 是否持续孵化
  keepSpawn: boolean;
  wayPoint?: string;
}

interface DataWithWayPoint {
  wayPoint?: string;
}
