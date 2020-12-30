interface Memory {
  // 移动的次数
  moveNumber?: number;
  // 移动消耗总用时
  moveUseCpu?: number;

  // 核弹投放指示器
  // 核弹是否已经确认
  nukerLock?: boolean;
  // 核弹发射指令集，键为发射房间，值为目标旗帜名称
  nukerDirective?: {
    [fireRoomName: string]: string;
  };

  // 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
  creepConfigs: {
    [creepName: string]: {
      // creep 的角色名
      role: CreepRoleConstant;
      // creep 的具体配置项，每个角色的配置都不相同
      data: CreepData;
      // 执行 creep 孵化的房间名
      spawnRoom: string;
    };
  };

  /**
   * 从其他 shard 跳跃过来的 creep 内存会被存放在这里
   * 等 creep 抵达后在由其亲自放在 creepConfigs 里
   *
   * 不能直接放在 creepConfigs
   * 因为有可能出现内存到了但是 creep 还没到的情况，这时候 creepController 就会以为这个 creep 死掉了从而直接把内存回收掉
   */
  crossShardCreeps: {
    [creepName: string]: CreepMemory | PowerCreepMemory;
  };

  // 要绕过的房间名列表，由全局模块 bypass 负责。
  bypassRooms: string[];
  // 掠夺资源列表，如果存在的话 reiver 将只会掠夺该名单中存在的资源
  reiveList: ResourceConstant[];

  // 商品生产线配置
  commodities: {
    // 键为工厂等级，值为被设置成对应等级的工厂所在房间名
    1: string[];
    2: string[];
    3: string[];
    4: string[];
    5: string[];
  };

  // 资源来源表
  resourceSourceMap: {
    // 资源类型为键，房间名列表为值
    [resourceType: string]: string[];
  };

  // 白名单，通过全局的 whitelist 对象控制
  // 键是玩家名，值是该玩家进入自己房间的 tick 时长
  whiteList: {
    [userName: string]: number;
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
    roomTaskNumber?: { [roomTransferTaskType: string]: number };

    /**
     * 房间内的数据统计
     */
    rooms: {
      [roomName: string]: RoomStats;
    };
    cpuCost?: Record<string, number>;
    gameTime?: number;
  };

  // 启动 powerSpawn 的房间名列表
  psRooms: string[];

  // 在模拟器中调试布局时才会使用到该字段，在正式服务器中不会用到该字段
  layoutInfo?: BaseLayout;
  // 用于标记布局获取到了那一等级
  layoutLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  /**
   * 延迟任务存储
   */
  delayTasks: DelayTaskMemory[];
}

interface RoomStats {
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
  structureNums?: { [structureName: string]: number };
  constructionSiteNums?: { [structureName: string]: number };
  /**
   * 本房间的总可用能量（包括 storage、terminal、container）
   */
  totalEnergy: number;
  /**
   * totalEnergy 统计时的 Game.time，用于计算下面的获取速率
   */
  energyCalcTime: number;
  /**
   * 升级工的生命总时长
   * 能量获取速率
   * 例如 100 代表 100 点能量/tick，值为负代表负增长
   */
  energyGetRate: number;
  /**
   * 搬运工的工作时长
   */
  transporterWorkingTime: number;
  /**
   * 搬运工的生命总时长
   */
  transporterLifeTime: number;
  /**
   * 其他种类的资源数量，由 factory 统计
   */
  commRes: { [commType: string]: number };
  /**
   * 测试消息预留
   */
  debugMessage?: unknown;
}
