import builder from "./builder";
import filler from "./filler";
import harvester from "./harvester";
import repairer from "./repairer";
import ruinCollector from "./ruinCollector";
import upgrader from "./upgrader";

const roles: CreepWork = {
  harvester,
  filler,
  upgrader,
  builder,
  repairer,
  ruinCollector
};

/**
 * 导出所有的角色
 */
export default roles;
