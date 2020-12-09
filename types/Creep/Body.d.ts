type BodySets = [BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet, BodySet];

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

/**
 * 身体配置项类别
 * 包含了所有角色类型的身体配置
 */
type BodyConfigs = {
  [type in BodyAutoConfigConstant]: BodyConfig;
};

type BodyConfig = {
  [energyLevel in EnergyLevel]: BodyPartConstant[];
};

type EnergyLevel = "300" | "550" | "800" | "1300" | "1800" | "2300" | "5600" | "10000";

type BodyAutoConfigConstant =
  | "harvester"
  | "worker"
  | "transporter"
  | "processor"
  | "upgrader"
  | "reserver"
  | "remoteHarvester"
  | "attacker"
  | "healer"
  | "remoteHelper"
  | "dismantler";
