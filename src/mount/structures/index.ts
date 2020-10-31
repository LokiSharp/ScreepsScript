import ControllerExtension from "./ControllerExtension";
import LabExtension from "./LabExtension";
import LinkExtension from "./LinkExtension";
import NukerExtension from "./NukerExtension";
import SpawnExtension from "./SpawnExtension";
import StorageExtension from "./StorageExtension";
import StructureExtension from "./StructureExtension";
import TowerExtension from "./TowerExtension";
import assignPrototype from "utils/assignPrototype";
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
  assignPrototype(StructureLab, LabExtension);
  assignPrototype(StructureNuker, NukerExtension);
  mountTerminal();
}
