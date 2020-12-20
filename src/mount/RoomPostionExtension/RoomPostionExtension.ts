/**
 * 房间位置拓展
 */
export default class RoomPostionExtension extends RoomPosition {
  private canStandPosCache: RoomPosition[];

  /**
   * 获取当前位置目标方向的 pos 对象
   *
   * @param direction 目标方向
   */
  public directionToPos(direction: DirectionConstant): RoomPosition | undefined {
    let targetX = this.x;
    let targetY = this.y;

    // 纵轴移动，方向朝下就 y ++，否则就 y --
    if (direction !== LEFT && direction !== RIGHT) {
      if (direction > LEFT || direction < RIGHT) targetY--;
      else targetY++;
    }
    // 横轴移动，方向朝右就 x ++，否则就 x --
    if (direction !== TOP && direction !== BOTTOM) {
      if (direction < BOTTOM) targetX++;
      else targetX--;
    }

    // 如果要移动到另一个房间的话就返回空，否则返回目标 pos
    if (targetX < 0 || targetY > 49 || targetX > 49 || targetY < 0) return undefined;
    else return new RoomPosition(targetX, targetY, this.roomName);
  }

  /**
   * 获取该位置周围的空位
   *
   * @param range 目标范围
   */
  public getFreeSpace(range = 1): RoomPosition[] {
    const terrain = new Room.Terrain(this.roomName);
    const result: RoomPosition[] = [];

    const xs = [this.x];
    const ys = [this.y];

    _.range(1, 1 + range).forEach(dxdy => {
      xs.push(this.x - dxdy, this.x + dxdy);
      ys.push(this.y - dxdy, this.y + dxdy);
    });

    // 遍历 x 和 y 坐标
    xs.forEach(x =>
      ys.forEach(y => {
        // 如果不是墙则 ++
        if (terrain.get(x, y) !== TERRAIN_MASK_WALL) result.push(new RoomPosition(x, y, this.roomName));
      })
    );

    return result;
  }

  /**
   * 获取该位置周围可站立的的空位
   *
   * @param range 目标范围
   */
  public getCanStandPos(range = 1): RoomPosition[] {
    if (!this.canStandPosCache) {
      this.canStandPosCache = this.getFreeSpace(range)
        .filter(pos => pos.canStand())
        .filter(pos => !pos.hasCreepStand());
    }

    return this.canStandPosCache;
  }

  /**
   * 判断当前位置是否可以站立 creep
   */
  public canStand(): boolean {
    const onPosStructures = this.lookFor(LOOK_STRUCTURES);

    // 遍历该位置上的所有建筑，如果建筑上不能站人的话就返回 false
    for (const structure of onPosStructures) {
      if (
        structure.structureType !== STRUCTURE_CONTAINER &&
        structure.structureType !== STRUCTURE_RAMPART &&
        structure.structureType !== STRUCTURE_ROAD
      )
        return false;
    }
    return true;
  }

  /**
   * 判断当前位置是否有 creep
   */
  public hasCreepStand(): boolean {
    const onPosCreep = this.lookFor(LOOK_CREEPS);
    return onPosCreep.length > 0;
  }
}
