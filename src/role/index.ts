import attacker from "./war/attacker";
import boostAttacker from "./war/boostAttacker";
import boostDismantler from "./war/boostDismantler";
import boostHealer from "./war/boostHealer";
import builder from "./base/builder";
import claimer from "./remote/claimer";
import collector from "./base/collector";
import defender from "./war/defender";
import dismantler from "./war/dismantler";
import filler from "./base/filler";
import harvester from "./base/harvester";
import healer from "./war/healer";
import manager from "./advanced/manager";
import moveTester from "./remote/moveTester";
import processor from "./advanced/processor";
import reiver from "./remote/reiver";
import remoteBuilder from "./remote/remoteBuilder";
import remoteHarvester from "./remote/remoteHarvester";
import remoteUpgrader from "./remote/remoteUpgrader";
import repairer from "./base/repairer";
import reserver from "./remote/reserver";
import signer from "./remote/signer";
import upgrader from "./base/upgrader";

const roles: CreepWork = {
  harvester,
  filler,
  upgrader,
  builder,
  repairer,
  manager,
  reserver,
  remoteHarvester,
  processor,
  collector,
  reiver,
  claimer,
  remoteBuilder,
  remoteUpgrader,
  moveTester,
  attacker,
  defender,
  healer,
  dismantler,
  boostDismantler,
  boostHealer,
  boostAttacker,
  signer
};

/**
 * 导出所有的角色
 */
export default roles;
