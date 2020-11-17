import mountControllerExtension from "./ControllerExtension";
import mountExtractorExtension from "./ExtractorExtension";
import mountFactoryExtension from "./FactoryExtension";
import mountLabExtension from "./LabExtension";
import mountLinkExtension from "./LinkExtension";
import mountNukerExtension from "./NukerExtension";
import mountObserverExtension from "./ObserverExtension";
import mountPowerSpawnExtension from "./PowerSpawnExtension";
import mountSpawnExtension from "./SpawnExtension";
import mountStorageExtension from "./StorageExtension";
import mountStructureExtension from "./StructureExtension";
import mountTerminalExtension from "./TerminalExtension";
import mountTowerExtension from "./TowerExtension";

/**
 * 挂载所有的额外属性和方法
 */
export default function mountStructure(): void {
  mountStructureExtension();
  mountControllerExtension();
  mountTowerExtension();
  mountSpawnExtension();
  mountLabExtension();
  mountNukerExtension();
  mountExtractorExtension();
  mountTerminalExtension();
  mountLinkExtension();
  mountPowerSpawnExtension();
  mountStorageExtension();
  mountObserverExtension();
  mountFactoryExtension();
}
