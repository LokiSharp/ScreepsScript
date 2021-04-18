interface Memory {
  /**
   * 延迟任务存储
   */
  delayTasks: string;
}

/**
 * 延迟任务的数据
 */
interface DelayTaskData {
  /**
   * 必须为延迟任务分配一个房间名
   * 执行回调时会自动将其转换为房间对象
   */
  roomName: string;
}

/**
 * 所有延迟任务的名称和数据的对应 map
 */
interface DelayTaskTypes {
  /**
   * 刷墙工延迟孵化任务
   */
  spawnFiller: DelayTaskData;
  /**
   * 挖矿工延迟孵化任务
   */
  spawnMiner: DelayTaskData;
  /**
   * 升级工延迟孵化任务
   */
  spawnUpgrader: DelayTaskData;
  /**
   * 建筑任务发布
   * 因为建筑必须在下个 tick 才能获取到其 id
   */
  addBuildTask: DelayTaskData & {
    /**
     * 该建筑工地应该位于的位置
     */
    pos: [number, number, string];
    /**
     * 该建筑的类型
     */
    type: BuildableStructureConstant;
  };
}

/**
 * 所有延迟任务的名字
 */
type AllDelayTaskName = keyof DelayTaskTypes;

/**
 * 延迟任务的回调
 *
 * @param data 任务的数据
 * @param room 该任务对应的房间对象，由数据中的 roomName 获取
 */
type DelayTaskCallback<K extends AllDelayTaskName> = (room: Room | undefined, data: DelayTaskTypes[K]) => void;

/**
 * 延迟任务数据
 */
interface DelayTask<T extends AllDelayTaskName = AllDelayTaskName> {
  /**
   * 该任务的名称
   * 会根据这个名称触发对应的回调
   */
  name: T;
  /**
   * 被 JSON.stringify 压缩成字符串的任务数据，其值为任务名 + 空格 + 任务数据
   */
  data: DelayTaskTypes[T];
}

interface Game {
  /**
   * 本 tick 是否需要保存延迟任务队列的数据
   */
  _needSaveDelayQueueData?: true;
}
