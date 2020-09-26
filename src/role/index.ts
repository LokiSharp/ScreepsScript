import filler from "./filler";
import harvester from "./harvester";
import upgrader from "./upgrader";
const roles: CreepWork = {
  harvester,
  filler,
  upgrader
};

/**
 * 导出所有的角色
 */
export default roles;
