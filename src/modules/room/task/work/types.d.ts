interface RoomMemory {
  workerNumber: number;
  /**
   * 房间工作任务的备份数据
   * 会在全局重置时通过该数据重建工作任务
   */
  workTasks: string;
  /**
   * 正在执行工作任务的 creep 的数据
   */
  workCreeps: string;
}

/**
 * 所有的物流任务类型
 */
type AllWorkTaskType = keyof WorkTasks;

/**
 * 所有的房间物流任务
 */
type AllRoomWorkTask = WorkTasks[AllWorkTaskType];

/**
 * 所有的物流任务
 */
interface WorkTasks {
  /**
   * 元素采集任务
   */
  mine: RoomTask<"mine">;
  /**
   * 升级任务
   */
  upgrade: RoomTask<"upgrade">;
  /**
   * 建造任务
   */
  build: RoomTask<"build"> & {
    targetId?: Id<ConstructionSite>;
  };
  /**
   * 初始 source container 建造任务
   */
  buildStartContainer: RoomTask<"buildStartContainer"> & {
    /**
     * 修建哪个 source 的 container
     * 会自己去找这个 source 周边的 container 工地去修
     */
    sourceId: Id<Source>;
    /**
     * 要修建的 container，执行任务时由 creep 自己储存
     */
    containerId?: Id<StructureContainer>;
  };
  /**
   * 维修任务
   */
  repair: RoomTask<"repair">;
  /**
   * 刷墙任务
   */
  fillWall: RoomTask<"fillWall">;
}

/**
 * 从内存 workList 字段解析出来的存储格式
 */
type WorkTaskData = WorkTasks[AllWorkTaskType][];

/**
 * 特殊身体类型
 */
type SepicalBodyType = "upgrade7" | "upgrade8";
