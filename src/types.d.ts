declare namespace NodeJS {
  // 全局对象
  interface Global {
    // 是否已经挂载拓展
    hasExtension: boolean;
  }
}

// 当 creep 不需要生成时 mySpawnCreep 返回的值
type CREEP_DONT_NEED_SPAWN = -101;
// spawn.mySpawnCreep 方法的返回值集合
type MySpawnReturnCode = ScreepsReturnCode | CREEP_DONT_NEED_SPAWN;

// 本项目中出现的颜色常量
type Colors = "green" | "blue" | "yellow" | "red";

interface Memory {
  // 是否显示 cpu 消耗
  showCost?: boolean;
  // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
  creepConfigs: {
    [creepName: string]: {
      // creep 的角色名
      role: CreepRoleConstant;
      // creep 的具体配置项，每个角色的配置都不相同
      data: CreepData;
      // 执行 creep 孵化的房间名
      spawnRoom: string;
      // creep 孵化时使用的身体部件
      // 为 string 时则自动规划身体部件，为 BodyPartConstant[] 时则强制生成该身体配置
      bodys: BodyAutoConfigConstant | BodyPartConstant[];
    };
  };
  stats: {
    // GCl/GPL 升级百分比
    gcl?: number;
    gclLevel?: number;
    gpl?: number;
    gplLevel?: number;
    // CPU 当前数值及百分比
    cpu?: number;
    // bucket 当前数值
    bucket?: number;
    // 当前还有多少钱
    credit?: number;

    // 已经完成的房间物流任务比例
    roomTaskNumber?: {
      [roomTransferTaskType: string]: number;
    };

    /**
     * 房间内的数据统计
     */
    rooms: {
      [roomName: string]: {
        // storage 中的能量剩余量
        energy?: number;
        // 终端中的 power 数量
        power?: number;
        // nuker 的资源存储量
        nukerEnergy?: number;
        nukerG?: number;
        nukerCooldown?: number;
        // 控制器升级进度，只包含没有到 8 级的
        controllerRatio?: number;
        controllerLevel?: number;

        // 其他种类的资源数量，由 factory 统计
        [commRes: string]: number;
      };
    };
  };
}

/**
 * bodySet
 * 简写版本的 bodyPart[]
 * 形式如下
 * @example { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 }
 */
interface BodySet {
  [MOVE]?: number;
  [CARRY]?: number;
  [ATTACK]?: number;
  [RANGED_ATTACK]?: number;
  [WORK]?: number;
  [CLAIM]?: number;
  [TOUGH]?: number;
  [HEAL]?: number;
}

type BodySets = [BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet];

type BodyConfig = {
  [energyLevel in 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000]: BodyPartConstant[];
};

/**
 * 身体配置项类别
 * 包含了所有角色类型的身体配置
 */
type BodyConfigs = {
  [type in BodyAutoConfigConstant]: BodyConfig;
};

/**
 * creep 的配置项
 * @property isNeed 决定 creep 在死后是否需要再次孵化
 * @property prepare creep 在进入 source/target 状态机之前要执行的额外阶段
 * @property source creep非工作(收集能量时)执行的方法
 * @property target creep工作时执行的方法
 */
interface ICreepConfig {
  isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
  prepare?: (creep: Creep) => boolean;
  source?: (creep: Creep) => boolean;
  target?: (creep: Creep) => boolean;
  bodys: BodyAutoConfigConstant | BodyPartConstant[];
}

type BodyAutoConfigConstant = "worker" | "manager" | "upgrader";

/**
 * 所有 creep 角色的 data
 */
type CreepData = EmptyData | HarvesterData;

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
  sourceId: string;
  // 把采集到的资源存到哪里存在哪里
  targetId: string;
}

/**
 * Creep 拓展
 * 来自于 mount.creep.ts
 */
interface Creep {
  _id: string;

  log(content: string, color?: Colors, notify?: boolean): void;
  work(): void;
  goTo(target: RoomPosition, range?: number): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  getEngryFrom(target: Structure | Source): ScreepsReturnCode;
  transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode;
  upgrade(): ScreepsReturnCode;
  buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND;
  steadyWall(): OK | ERR_NOT_FOUND;
}

/**
 * creep 内存拓展
 */
interface CreepMemory {
  // creep 的角色
  role: CreepRoleConstant;
  // creep 是否已经准备好可以工作了
  ready: boolean;
  // 是否在工作
  working: boolean;
  // creep 在工作时需要的自定义配置，在孵化时由 spawn 复制
  data?: CreepData;
  // 该 Creep 是否在站着不动进行工作
  // 该字段用于减少 creep 向 Room.restrictedPos 里添加自己位置的次数
  standed?: boolean;
  // 要采集的资源 Id
  // 要采集的资源 Id
  sourceId?: string;
  // 要存放到的目标建筑
  targetId?: string;
  fillWallId?: string;
  // manager 特有 要填充能量的建筑 id
  fillStructureId?: string;
  // 建筑工特有，当前缓存的建筑工地（目前只有外矿采集者在用）
  constructionSiteId?: string;
  // 可以执行建筑的单位特有，当该值为 true 时将不会尝试建造
  dontBuild?: boolean;
}

// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant;

// 房间基础运营
type BaseRoleConstant = "harvester" | "filler" | "upgrader" | "builder";

/**
 * creep 工作逻辑集合
 * 包含了每个角色应该做的工作
 */
type CreepWork = {
  [role in CreepRoleConstant]: (data: CreepData) => ICreepConfig;
};

/**
 * 房间拓展
 * 来自于 mount.structure.ts
 */
interface Room {
  log(content: string, instanceName: string, color?: Colors | undefined, notify?: boolean): void;

  // creep 发布 api
  releaseCreep(role: BaseRoleConstant): ScreepsReturnCode;
  registerContainer(container: StructureContainer): OK;

  /**
   * 下述方法在 @see /src/mount.room.ts 中定义
   */
  // 孵化队列 api
  addSpawnTask(taskName: string): number | ERR_NAME_EXISTS;
  hasSpawnTask(taskName: string): boolean;
  clearSpawnTask(): void;
  hangSpawnTask(): void;

  // 房间物流 api
  addRoomTransferTask(task: RoomTransferTasks, priority?: number): number;
  hasRoomTransferTask(taskType: string): boolean;
  getRoomTransferTask(): RoomTransferTasks | null;
  handleLabInTask(resourceType: ResourceConstant, amount: number): boolean;
  deleteCurrentRoomTransferTask(): void;

  // 禁止通行点位 api
  addRestrictedPos(creepName: string, pos: RoomPosition): void;
  getRestrictedPos(): { [creepName: string]: string };
  removeRestrictedPos(creepName: string): void;

  // pos 处理 api
  serializePos(pos: RoomPosition): string;
  unserializePos(posStr: string): RoomPosition | undefined;

  sources: Source[];
  sourceContainers: StructureContainer[];

  _sources: Source[];
  _sourceContainers: StructureContainer[];

  // 获取房间中的有效能量来源
  getAvailableSource(): StructureTerminal | StructureStorage | StructureContainer | Source;
}

/**
 * 房间内存
 */
interface RoomMemory {
  // 该房间的生产队列，元素为 creepConfig 的键名
  spawnList?: string[];
  sourceIds: string[];
  sourceContainersIds: string[];

  // 该房间禁止通行点的存储
  // 键为注册禁止通行点位的 creep 名称，值为禁止通行点位 RoomPosition 对象的序列字符串
  restrictedPos?: {
    [creepName: string]: string;
  };
  // 基地中心点坐标, [0] 为 x 坐标, [1] 为 y 坐标
  center: [number, number];

  // 建筑工的当前工地目标，用于保证多个建筑工的工作统一以及建筑工死后不会寻找新的工地
  constructionSiteId: string;
  // 建筑工特有，当前正在修建的建筑类型，用于在修建完成后触发对应的事件
  constructionSiteType?: StructureConstant;
  // 建筑工地的坐标，用于在建造完成后进行 lookFor 来确认其是否成功修建了建筑
  constructionSitePos: number[];

  // 当前被 repairer 或 tower 关注的墙
  focusWall: {
    id: string;
    endTime: number;
  };

  // 房间物流任务队列
  transferTasks: RoomTransferTasks[];
}

interface RoomPosition {
  directionToPos(direction: DirectionConstant): RoomPosition | undefined;
  getFreeSpace(): RoomPosition[];
}

type RoomTransferTasks = IFillExtension;

// 房间物流任务 - 填充拓展
interface IFillExtension {
  type: string;
}

interface transferTaskOperation {
  // creep 工作时执行的方法
  target: (creep: Creep, task: RoomTransferTasks) => boolean;
  // creep 非工作(收集资源时)执行的方法
  source: (creep: Creep, task: RoomTransferTasks, sourceId: string) => boolean;
}

/**
 * creep 发布计划职责链上的一个节点
 *
 * @param detail 该 creep 发布所需的房间信息
 * @returns 代表该发布计划是否适合房间状态
 */
type PlanNodeFunction = (detail: UpgraderPlanStats | HarvesterPlanStats | TransporterPlanStats) => boolean;

// 房间中用于发布 upgrader 所需要的信息
interface UpgraderPlanStats {
  // 房间对象
  room: Room;
  // 房间内的控制器等级
  controllerLevel: number;
  // 控制器还有多久降级
  ticksToDowngrade: number;
  // source 建造好的 container 的 id
  sourceContainerIds: string[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内 terminal 的 id，房间没 terminal 时该值为空，下同
  terminalId?: string;
  // 房间内 upgradeLink 的 id
  upgradeLinkId?: string;
  // storage 中有多少能量
  storageEnergy?: number;
  // terminal 中有多少能量
  terminalEnergy?: number;
}

// 房间中用于发布 harvester 所需要的信息
interface HarvesterPlanStats {
  // 房间对象
  room: Room;
  // 房间内 source 的 id 和其配套的 link id
  sources: {
    id: string;
    linkId: string;
  }[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内中央 link 的 id
  centerLinkId?: string;
}

// 房间中用于发布 filler manager processor 所需要的信息
interface TransporterPlanStats {
  // 房间对象
  room: Room;
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: string;
  // 房间内中央 link 的 id
  centerLinkId?: string;
  // source 建造好的 container 的 id
  sourceContainerIds?: string[];
  // 基地中心点（processor的位置）坐标
  centerPos?: [number, number];
}

// 发布角色配置项需要的素材集合
interface ReleasePlanConstructor<T> {
  // 搜集发布该角色需要的房间信息
  getStats: (room: Room) => T;
  // 发布计划的集合，会根据收集到的房间信息选择具体的计划
  plans: PlanNodeFunction[];
}

// 所有使用发布计划的角色
interface CreepReleasePlans {
  harvester: ReleasePlanConstructor<HarvesterPlanStats>;
  upgrader: ReleasePlanConstructor<UpgraderPlanStats>;
  transporter: ReleasePlanConstructor<TransporterPlanStats>;
}

/**
 * 建筑拓展
 */
interface Structure {
  // 是否为自己的建筑，某些建筑不包含此属性，也可以等同于 my = false
  my?: boolean;
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param instanceName 发送日志的实例名
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  log(content: string, color?: Colors, notify?: boolean): void;
  // 建筑的工作方法
  work?(): void;
  // 建筑在完成建造时触发的回调
  onBuildComplete?(): void;
}
