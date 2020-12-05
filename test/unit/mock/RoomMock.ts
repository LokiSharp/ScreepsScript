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
