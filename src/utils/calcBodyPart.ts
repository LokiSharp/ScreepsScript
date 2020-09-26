/**
 * 根据身体配置生成完成的身体数组
 * cpu 消耗: 0.028 左右
 *
 * @param bodySet 身体部件配置对象
 */
export function calcBodyPart(bodySet: BodySet): BodyPartConstant[] {
  // 把身体配置项拓展成如下形式的二维数组
  // [ [ TOUGH ], [ WORK, WORK ], [ MOVE, MOVE, MOVE ] ]
  const bodys = Object.keys(bodySet).map(type => Array(bodySet[type]).fill(type) as BodySet[]);
  // 把二维数组展平
  return [].concat(...bodys) as BodyPartConstant[];
}
