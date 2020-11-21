// 所有的 creep 角色
type CreepRoleConstant = BaseRoleConstant | AdvancedRoleConstant | RemoteRoleConstant | WarRoleConstant;
// 房间基础运营
type BaseRoleConstant = "harvester" | "filler" | "upgrader" | "builder" | "repairer" | "collector" | "miner";
type AdvancedRoleConstant = "manager" | "processor";
// 远程单位
type RemoteRoleConstant =
  | "reserver"
  | "remoteHarvester"
  | "reiver"
  | "claimer"
  | "remoteUpgrader"
  | "remoteBuilder"
  | "moveTester"
  | "signer"
  | "pbAttacker"
  | "pbCarrier"
  | "pbHealer"
  | "depositHarvester"
  | "buildHelper";
// 战斗单位
type WarRoleConstant =
  | "attacker"
  | "defender"
  | "healer"
  | "dismantler"
  | "boostAttacker"
  | "boostHealer"
  | "boostDismantler"
  | "rangedAttacker";
