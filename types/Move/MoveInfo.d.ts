/**
 * 移动的内存数据
 */
interface MoveInfo {
  /**
   * 序列化之后的路径信息
   */
  path?: string;

  /**
   * 上一个位置信息，形如"14/4"，用于在 creep.move 返回 OK 时检查有没有撞停
   */
  prePos?: string;

  /**
   * 上一次移动的方向，用于在下个 tick 发现移动失败时检查前面时什么东西
   */
  lastMove?: DirectionConstant;

  /**
   * 要移动到的目标位置，creep 会用这个字段判断目标是否变化了
   */
  targetPos?: string;

  /**
   * 数组形式传入的路径点
   */
  wayPoints?: string[];

  /**
   * 路径旗帜名（包含后面的编号，如 waypoint1 或者 waypoint99）
   */
  wayPointFlag?: string;
}
