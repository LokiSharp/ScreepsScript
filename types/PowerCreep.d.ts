/**
 * Creep 拓展
 * 来自于 mount.powerCreep.ts
 */
interface PowerCreep {
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param instanceName 发送日志的实例名
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  log(content: string, color?: Colors, notify?: boolean): void;

  updatePowerToRoom(): void;
  _move(direction: DirectionConstant | Creep): CreepMoveReturnCode | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET;
  goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode;
  setWayPoint(target: string[] | string): ScreepsReturnCode;
  requireCross(direction: DirectionConstant): boolean;
  enablePower(): OK | ERR_BUSY;
  getOps(opsNumber: number): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY;
}
/**
 * 每种 power 所对应的的任务配置项
 *
 * @property {} needExecute 该 power 的检查方法
 * @property {} run power 的具体工作内容
 */
interface IPowerTaskConfig {
  /**
   * power 的资源获取逻辑
   *
   * @returns OK 任务完成，将会执行下面的 target 方法
   * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足，将会强制切入 ops 生成任务
   * @returns ERR_BUSY 任务未完成，保留工作状态，后续继续执行
   */
  source?: (creep: PowerCreep) => OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY;
  /**
   * power 的具体工作逻辑
   *
   * @returns OK 任务完成，将会继续检查后续 power
   * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足，将会执行上面的 source 方法，如果没有 source 的话就强制切入 ops 生成任务
   * @returns ERR_BUSY 任务未完成，保留工作状态，后续继续执行
   */
  target: (creep: PowerCreep) => OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY;
}
/**
 * 所有 power 的任务配置列表
 */
interface IPowerTaskConfigs {
  [powerType: string]: IPowerTaskConfig;
}
