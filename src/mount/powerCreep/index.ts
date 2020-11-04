import PowerCreepExtension from "./PowerCreepExtension";
import assignPrototype from "utils/assignPrototype";

// 挂载拓展到 PowerCreep 原型
export default function (): void {
  assignPrototype(PowerCreep, PowerCreepExtension);
}
