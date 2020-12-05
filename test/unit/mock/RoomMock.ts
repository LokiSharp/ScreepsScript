import BaseMock from "./BaseMock";
import RoomMemoryMock from "./RoomMemoryMock";
import StructureTerminalMock from "./StructureTerminalMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class RoomMock extends BaseMock {
  public controller?: StructureController;
  public energyAvailable: number;
  public energyCapacityAvailable: number;
  public memory: RoomMemory;
  public mode: string;
  public readonly name: string;
  public storage?: StructureStorage;
  public terminal?: StructureTerminalMock;
  public visual: RoomVisual;

  public [STRUCTURE_FACTORY]?: StructureFactory;
  public [STRUCTURE_POWER_SPAWN]?: StructurePowerSpawn;
  public [STRUCTURE_NUKER]?: StructureNuker;
  public [STRUCTURE_OBSERVER]?: StructureObserver;
  public [STRUCTURE_EXTRACTOR]?: StructureExtractor;

  public [STRUCTURE_SPAWN]?: StructureSpawn[];
  public [STRUCTURE_EXTENSION]?: StructureExtension[];
  public [STRUCTURE_ROAD]?: StructureRoad[];
  public [STRUCTURE_WALL]?: StructureWall[];
  public [STRUCTURE_RAMPART]?: StructureRampart[];
  public [STRUCTURE_KEEPER_LAIR]?: StructureKeeperLair[];
  public [STRUCTURE_PORTAL]?: StructurePortal[];
  public [STRUCTURE_LINK]?: StructureLink[];
  public [STRUCTURE_TOWER]?: StructureTower[];
  public [STRUCTURE_LAB]?: StructureLab[];
  public [STRUCTURE_CONTAINER]?: StructureContainer[];

  public constructor(name: string) {
    super();
    this.name = name;
    Memory.rooms[name] = new RoomMemoryMock();
    this.memory = Memory.rooms[name];
  }

  @pushMethodCallInfoToCalled
  public createConstructionSite(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public createFlag(): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string {
    return undefined;
  }

  public find(): FindTypes[] {
    return undefined;
  }

  public findExitTo(): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS {
    return undefined;
  }

  public findPath(): PathStep[] {
    return undefined;
  }

  public getPositionAt(): RoomPosition | null {
    return undefined;
  }

  public getTerrain(): RoomTerrain {
    return undefined;
  }

  public lookAt(): LookAtResult[] {
    return undefined;
  }

  public lookAtArea(): LookAtResultWithPos[] {
    return undefined;
  }

  public lookForAt(): AllLookAtTypes[][] {
    return undefined;
  }

  public lookForAtArea(): LookForAtAreaResultArray<AllLookAtTypes, any> {
    return undefined;
  }
}
