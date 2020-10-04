import builder from "./base/builder";
import filler from "./base/filler";
import harvester from "./base/harvester";
import manager from "./manager";
import remoteHarvester from "./remote/remoteHarvester";
import repairer from "./base/repairer";
import reserver from "./remote/reserver";
import ruinCollector from "./ruinCollector";
import upgrader from "./base/upgrader";

const roles: CreepWork = {
  harvester,
  filler,
  upgrader,
  builder,
  repairer,
  ruinCollector,
  manager,
  reserver,
  remoteHarvester
};

/**
 * 导出所有的角色
 */
export default roles;
