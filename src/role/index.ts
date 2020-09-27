import builder from "./builder";
import filler from "./filler";
import harvester from "./harvester";
import repairer from "./repairer";
import upgrader from "./upgrader";

const roles: CreepWork = {
  harvester,
  filler,
  upgrader,
  builder,
  repairer
};

/**
 * 导出所有的角色
 */
export default roles;
