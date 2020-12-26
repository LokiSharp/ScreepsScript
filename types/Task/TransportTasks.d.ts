/**
 * 所有的物流任务类型
 */
type AllTransportTaskType = keyof TransportTasks;

/**
 * 所有的房间物流任务
 */
type AllRoomTransportTask = TransportTasks[AllTransportTaskType];

/**
 * 所有的物流任务
 */
interface TransportTasks {
  /**
   * 基础搬运任务
   */
  transport: RoomTask<"transport"> & {
    /**
     * 从哪里搬运，数字元组代表一个位置
     */
    from: [number, number, string] | Id<StructureWithStore>;
    /**
     * 搬运到哪里
     */
    to: [number, number, string] | Id<StructureWithStore>;
    /**
     * 搬运啥
     */
    resourceType: ResourceConstant;
    /**
     * 怎么算完成任务：clear 代表目标位置不存在该资源就完成任务
     * 该字段的话该任务将永远不会结束，需要外部模块手动取消
     */
    endWith?: "clear";
  };
  /**
   * 填充 spawn 及 extension
   */
  fillExtension: RoomTask<"fillExtension">;
  /**
   * 填充 tower
   */
  fillTower: RoomTask<"fillTower"> & {
    id: Id<StructureTower>;
  };
  /**
   * 填充 nuker
   */
  fillNuker: RoomTask<"fillNuker"> & {
    id: Id<StructureNuker>;
    resourceType: ResourceConstant;
  };
  /**
   * 填充 powerSpawn
   */
  fillPowerSpawn: RoomTask<"fillPowerSpawn"> & {
    id: Id<StructurePowerSpawn>;
    resourceType: ResourceConstant;
  };
  /**
   * lab 填充底物
   */
  labIn: RoomTask<"labIn"> & {
    resource: {
      id: Id<StructureLab>;
      type: ResourceConstant;
    }[];
  };
  /**
   * lab 移出产物
   */
  labOut: RoomTask<"labOut">;
  /**
   * boost 填充资源
   */
  boostGetResource: RoomTask<"boostGetResource">;
  /**
   * boost 填充能量
   */
  boostGetEnergy: RoomTask<"boostGetEnergy">;
  /**
   * boost 清理资源
   */
  boostClear: RoomTask<"boostClear">;
}

/**
 * 物流任务基础信息
 */
interface RoomTask<T extends string> {
  /**
   * 该物流任务的类型
   */
  type: T;
  /**
   * 该物流任务的优先级
   * 若为空则按照发布顺序进行排序
   */
  priority?: number;
  /**
   * 正在执行该任务的搬运工 id
   */
  executor?: Id<Creep>[];
  /**
   * 该任务的唯一索引
   */
  key?: number;
}

/**
 * 从内存 transport 字段解析出来的存储格式
 */
type TransportData = TransportTasks[AllTransportTaskType][];

interface TransportAction {
  /**
   * creep 工作时执行的方法
   */
  target: () => boolean;
  /**
   * creep 非工作(收集资源时)执行的方法
   */
  source: () => boolean;
}

interface RoomTransportType {
  /**
   * 本物流对象所处的房间名
   */
  readonly roomName: string;

  /**
   * 当前正在执行的所有物流任务
   */
  tasks: TransportTasks[AllTransportTaskType][];

  /**
   * 本房间的搬运工总生命时长
   */
  totalLifeTime: number;

  /**
   * 本房间的搬运工总工作时长
   */
  totalWorkTime: number;
  /**
   * 填写一个新的房间物流任务
   *
   * @param task 要添加的物流任务
   * @param canRepeat 任务类型能否重复
   * @param disableDispatchTask 是否禁用重分配（测试用）
   * @returns taskKey 该任务的唯一索引
   */
  addTask(task: AllRoomTransportTask, canRepeat?: boolean, disableDispatchTask?: boolean): number;
  /**
   * 获取应该执行的任务
   */
  getWork(creep: Creep): TransportAction;
  /**
   * 是否存在某个任务
   */
  hasTask(taskType: AllTransportTaskType);
  /**
   * 移除一个任务
   */
  removeTask(taskKey: number): OK | ERR_NOT_FOUND;
  /**
   * 获取该房间的搬运工调整期望
   */
  getExpect(): number;
}

/**
 * 物流搬运任务逻辑的生成函数
 */
type TransportActionGenerator<T extends AllTransportTaskType = AllTransportTaskType> = (
  creep: Creep<"manager">,
  task: TransportTasks[T]
) => TransportAction;
