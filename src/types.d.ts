// example declaration file - remove these and add your own custom typings
/**
 * bodySet
 * 简写版本的 bodyPart[]
 * 形式如下
 * @example { [WORK]: 2, [CARRY]: 1, [MOVE]: 1 }
 */
interface BodySet {
  [MOVE]?: number;
  [CARRY]?: number;
  [ATTACK]?: number;
  [RANGED_ATTACK]?: number;
  [WORK]?: number;
  [CLAIM]?: number;
  [TOUGH]?: number;
  [HEAL]?: number;
}

type BodySets = [BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet];

type BodyConfig = {
  [energyLevel in 300 | 550 | 800 | 1300 | 1800 | 2300 | 5600 | 10000]: BodyPartConstant[];
};
