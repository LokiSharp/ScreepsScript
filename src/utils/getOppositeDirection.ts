/**
 * 获取指定方向的相反方向
 *
 * @param direction 目标方向
 */
export function getOppositeDirection(direction: DirectionConstant): DirectionConstant {
  return (((direction + 3) % 8) + 1) as DirectionConstant;
}
