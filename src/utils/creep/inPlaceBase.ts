/**
 * creep 就位基础阶段
 * 本方法抽象出了 Creep 通用的 wayPoint 阶段和 inPlace 阶段
 */
export const inPlaceBase = <Role extends CreepRoleConstant>(): ICreepStage<Role> => ({
  wayPoint: creep => {
    const { wayPoint } = creep.memory.data as DataWithWayPoint;
    if (wayPoint) creep.setWayPoint(wayPoint);
    return true;
  },
  inPlace: creep => {
    if (creep.memory.moveInfo?.wayPoints) {
      creep.goTo(undefined, {
        checkTarget: true,
        range: 0
      });
      return creep.memory.moveInfo?.wayPoints?.length <= 0;
    }
    return true;
  }
});
