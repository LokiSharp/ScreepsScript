import RoomObjectMock from "./RoomObjectMock";

export default class StructureSpawnMock extends RoomObjectMock {
  public energy: number;
  public energyCapacity: number;
  public hits: number;
  public hitsMax: number;
  public id: Id<this>;
  public memory: SpawnMemory;
  public my: boolean;
  public name: string;
  public owner: STRUCTURE_SPAWN extends STRUCTURE_CONTROLLER ? Owner | undefined : Owner;
  public readonly prototype: StructureSpawn;
  public spawning: Spawning | null;
  public store: Store<RESOURCE_ENERGY, false>;
  public structureType: STRUCTURE_SPAWN;

  public canCreateCreep(): ScreepsReturnCode {
    return undefined;
  }

  public createCreep(): ScreepsReturnCode | string {
    return undefined;
  }

  public destroy(): ScreepsReturnCode {
    return undefined;
  }

  public isActive(): boolean {
    return false;
  }

  public log(): void {
    // PASS
  }

  public notifyWhenAttacked(): ScreepsReturnCode {
    return undefined;
  }

  public onBuildComplete(): void {
    // PASS
  }

  public recycleCreep(): ScreepsReturnCode {
    return undefined;
  }

  public renewCreep(): ScreepsReturnCode {
    return undefined;
  }

  public spawnCreep(): ScreepsReturnCode {
    return undefined;
  }

  public work(): void {
    // PASS
  }
}
