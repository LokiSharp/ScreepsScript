import { StructureMock } from "./StructureMock";
import { getMock } from "./utils";

class StructureSpawnMock extends StructureMock {
  public memory = {};
  public name = "mockSpawn";
  public spawning: Spawning | null;
  public store: Store<RESOURCE_ENERGY, false>;
  public spawnCreep = (): void => {
    // PASS
  };
  public renewCreep = (): void => {
    // PASS
  };
  public recycleCreep = (): void => {
    // PASS
  };

  public constructor() {
    super(STRUCTURE_SPAWN);
  }
}

export const getMockSpawn = getMock<StructureSpawn>(StructureSpawnMock);
