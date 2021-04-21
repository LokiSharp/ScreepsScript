import { getMock } from "./utils";
import { getMockSpawn } from "./SpawnMock";

class SpawningMock {
  public directions: DirectionConstant[] = [TOP];
  public name = "mockCreep";
  public needTime = 10;
  public remainingTime = 10;
  public spawn: StructureSpawn = getMockSpawn();
  public cancel = (): void => {
    // PASS
  };
  public setDirections = (): void => {
    // PASS
  };
}

export const getMockSpawning = getMock<Spawning>(SpawningMock);
