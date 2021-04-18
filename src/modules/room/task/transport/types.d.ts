interface RoomMemory {
  /**
   * 房间物流任务的备份数据
   * 会在全局重置时通过该数据重建物流任务
   */
  transportTasks: string;
  /**
   * 正在执行房间物流任务的 creep 的数据
   */
  transportCreeps: string;
}

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
     * 该字段为空的话该任务将永远不会结束，需要外部模块手动取消（或者 from 指定的建筑不存在了也会结束）
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
 * 从内存 transport 字段解析出来的存储格式
 */
type TransportData = TransportTasks[AllTransportTaskType][];
