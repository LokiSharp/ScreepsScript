import builder from "./base/builder";
import collector from "./base/collector";
import filler from "./base/filler";
import harvester from "./base/harvester";
import manager from "./advanced/manager";
import processor from "./advanced/processor";
import remoteHarvester from "./remote/remoteHarvester";
import repairer from "./base/repairer";
import reserver from "./remote/reserver";
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
  collector
};

/**
 * 导出所有的角色
 */
export default roles;
