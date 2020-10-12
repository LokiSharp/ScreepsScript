import ControllerExtension from "./controller";
import { LinkExtension } from "./link";
import SpawnExtension from "./spawn";
import StorageExtension from "./storage";
import StructureExtension from "./structure";
import TowerExtension from "./tower";
import { assignPrototype } from "utils/prototype";
import mountTerminal from "./terminal";

/**
 * 挂载所有的额外属性和方法
 */
export default function (): void {
  assignPrototype(Structure, StructureExtension);
  assignPrototype(StructureController, ControllerExtension);
  assignPrototype(StructureTower, TowerExtension);
  assignPrototype(Spawn, SpawnExtension);
  assignPrototype(StructureStorage, StorageExtension);
  assignPrototype(StructureLink, LinkExtension);
  mountTerminal();
}
