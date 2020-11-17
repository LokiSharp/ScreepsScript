import ControllerExtension from "./ControllerExtension";
import ExtractorExtension from "./ExtractorExtension";
import LabExtension from "./LabExtension";
import NukerExtension from "./NukerExtension";
import SpawnExtension from "./SpawnExtension";
import StructureExtension from "./StructureExtension";
import TowerExtension from "./TowerExtension";
import assignPrototype from "utils/assignPrototype";
import mountFactoryExtension from "./FactoryExtension";
import mountLinkExtension from "./LinkExtension";
import mountObserverExtension from "./ObserverExtension";
import mountPowerSpawnExtension from "./PowerSpawnExtension";
import mountStorageExtension from "./StorageExtension";
import mountTerminalExtension from "./TerminalExtension";

/**
 * 挂载所有的额外属性和方法
 */
export default function mountStructure(): void {
  assignPrototype(Structure, StructureExtension);
  assignPrototype(StructureController, ControllerExtension);
  assignPrototype(StructureTower, TowerExtension);
  assignPrototype(Spawn, SpawnExtension);
  assignPrototype(StructureLab, LabExtension);
  assignPrototype(StructureNuker, NukerExtension);
  assignPrototype(StructureExtractor, ExtractorExtension);
  mountTerminalExtension();
  mountLinkExtension();
  mountPowerSpawnExtension();
  mountStorageExtension();
  mountObserverExtension();
  mountFactoryExtension();
}
