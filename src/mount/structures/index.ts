import ControllerExtension from "./controller";
import SpawnExtension from "./spawn";
import StructureExtension from "./structure";
import { assignPrototype } from "utils/prototype";

/**
 * 挂载所有的额外属性和方法
 */
export default function (): void {
  assignPrototype(Structure, StructureExtension);
  assignPrototype(StructureController, ControllerExtension);
  assignPrototype(Spawn, SpawnExtension);
}
