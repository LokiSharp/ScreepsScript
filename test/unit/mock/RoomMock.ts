import BaseMock from "./BaseMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";
import RoomMemoryMock from "./RoomMemoryMock";

export default class RoomMock extends BaseMock {
  public constructor(name: string) {
    super();
    this.name = name;
    Memory.rooms[name] = new RoomMemoryMock();
    this.memory = Memory.rooms[name];
  }
  public controller?: StructureController;

  public energyAvailable: number;

  public energyCapacityAvailable: number;

  public memory: RoomMemory;

  public mode: string;

  public readonly name: string;

  public storage?: StructureStorage;

  public terminal?: StructureTerminal;

  public visual: RoomVisual;
  @pushMethodCallInfoToCalled
  public createConstructionSite(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public createFlag(): ERR_NAME_EXISTS | ERR_INVALID_ARGS | string {
    return "";
  }

  //   public find(): FindTypes[] {
  //     return [];
  //   }

  //   public findExitTo(): ExitConstant | ERR_NO_PATH | ERR_INVALID_ARGS;

  //   public findPath(): PathStep[];

  //   public getPositionAt(): RoomPosition | null;

  //   public getTerrain(): RoomTerrain;

  //   public lookAt(): LookAtResult[];

  //   public lookAtArea(): LookAtResultWithPos[];

  //   public lookForAt(): AllLookAtTypes[T][];

  //   public lookForAtArea(): LookForAtAreaResultArray<AllLookAtTypes[T], T>;
}
