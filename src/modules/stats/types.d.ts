interface StatsMemory {
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
}

interface RoomStats {
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
  energyGetRates: number[];
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
  resources: { [resourceType: string]: number };
}

interface Memory {
  /**
   * 全局统计信息
   */
  stats: StatsMemory;
}
