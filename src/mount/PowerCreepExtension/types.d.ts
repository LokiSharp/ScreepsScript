/**
 * PowerCreep 内存拓展
 */
interface PowerCreepMemory {
  /**
   * 移动缓存
   */
  moveInfo?: MoveInfo;

  /**
   * 是否打印上一步座标
   */
  logPrePos?: boolean;

  // 等同于 Creep.memory.fromShard
  fromShard?: ShardName;

  // pc 暂时没有角色
  role: undefined;
  // creep 是否已经准备好可以工作了
  ready: boolean;
  // 是否设置了路径点
  setWayPoint: boolean;
  // 是否抵达了路径点
  inPlace: boolean;
  // 工作的房间名，在第一次出生时由玩家指定，后面会根据该值自动出生到指定房间
  workRoom: string;

  /**
   * 同 creep.memory.stand
   */
  stand: boolean;

  /**
   * 同 creep.memory.disableCross
   */
  disableCross?: boolean;
}

/**
 * Creep 拓展
 */
interface PowerCreep {
  log(content: string, color?: Colors, notify?: boolean): void;

  goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode;
  setWayPoint(target: string[] | string): ScreepsReturnCode;
}
