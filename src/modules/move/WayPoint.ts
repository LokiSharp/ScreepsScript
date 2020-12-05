export class WayPoint {
  /**
   * 路径点缓存
   *
   * Creep 会把自己下一个路径点对应的位置缓存在这里，这样就不用每 tick 都从内存中的路径点字符串重建位置
   * 不过这么做会导致 creep 无法立刻感知到位置的变化
   *
   * 其键为 creep 的名字，值为下一个路径目标
   */
  public static wayPointCache: { [creepName: string]: RoomPosition } = {};

  /**
   * 更新路径点
   *
   * 当抵达当前路径点后就需要更新内存数据以移动到下一个路径点
   */
  public static updateWayPoint(creep: Creep | PowerCreep): void {
    if (!creep.memory.moveInfo) creep.memory.moveInfo = {};
    const memory = creep.memory.moveInfo;

    if (memory.wayPoints) {
      // 弹出已经抵达的路径点
      if (memory.wayPoints.length > 0) memory.wayPoints.shift();
    } else if (memory.wayPointFlag) {
      const preFlag = Game.flags[memory.wayPointFlag];

      // 如果旗帜内存里指定了下一个路径点名称的话就直接使用
      if (preFlag && preFlag.memory && preFlag.memory.next) {
        memory.wayPointFlag = preFlag.memory.next;
      }

      // 否则就默认自增编号
      else {
        // 获取路径旗帜名
        const flagPrefix = memory.wayPointFlag.slice(0, memory.wayPointFlag.length - 1);
        // 把路径旗帜的编号 + 1
        const nextFlagCode = Number(memory.wayPointFlag.substr(-1)) + 1;
        // 把新旗帜更新到内存，这里没有检查旗帜是否存在
        // 原因在于跨 shard 需要在跨越之前将旗帜更新到下一个，但是这时还没有到下个 shard，就获取不到位于下个 shard 的旗帜
        memory.wayPointFlag = flagPrefix + nextFlagCode.toString();
      }
    }

    // 移除缓存以便下次可以重新查找目标
    delete this.wayPointCache[creep.name];
  }

  /**
   * 给 Creep 设置路径点目标
   *
   * target 是一个路径数组或者路径旗帜
   *
   * @param creep 目标 creep
   * @param target 路径点目标
   */

  public static setWayPoint(creep: Creep | PowerCreep, target: string[] | string): CreepMoveReturnCode {
    if (!creep.memory.moveInfo) creep.memory.moveInfo = {};
    delete this.wayPointCache[creep.name];

    // 设置时会移除另一个路径模式的数据，防止这个移动完之后再回头走之前留下的路径点
    if (target instanceof Array) {
      creep.memory.moveInfo.wayPoints = target;
      delete creep.memory.moveInfo.wayPointFlag;
    } else {
      creep.memory.moveInfo.wayPointFlag = target + "0";
      delete creep.memory.moveInfo.wayPoints;
    }

    return OK;
  }
}
