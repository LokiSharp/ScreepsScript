import PowerCreepExtension from "./PowerCreepExtension";
import assignPrototype from "utils/assignPrototype";

// 挂载拓展到 PowerCreep 原型
export default function mountPowerCreep(): void {
  assignPrototype(PowerCreep, PowerCreepExtension);
}
