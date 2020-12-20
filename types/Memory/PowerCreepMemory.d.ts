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
  // 为 true 时执行 target，否则执行 source
  working: boolean;
  // 接下来要检查哪个 power
  powerIndex: number;
  // 当前要处理的工作
  // 字段值均为 PWR_* 常量
  // 在该字段不存在时将默认执行 PWR_GENERATE_OPS（如果 power 资源足够并且 ops 不足时）
  task: PowerConstant;
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

  // 要添加 REGEN_SOURCE 的 souce 在 room.sources 中的索引值
  sourceIndex?: number;
}
