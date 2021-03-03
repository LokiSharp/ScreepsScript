import RoomObjectMock from "./RoomObjectMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class StructureTerminalMock extends RoomObjectMock {
  public constructor(x: number, y: number) {
    super(x, y);
    this.store = {} as Store<ResourceConstant, any>;
  }

  public cooldown: number;
  public hits: number;
  public hitsMax: number;
  public id: Id<this>;
  public my: boolean;
  public owner: STRUCTURE_TERMINAL extends STRUCTURE_CONTROLLER ? Owner | undefined : Owner;
  public readonly prototype: StructureTerminal;
  public store: StoreDefinition;
  public storeCapacity: number;
  public structureType: STRUCTURE_TERMINAL;

  @pushMethodCallInfoToCalled
  public destroy(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public isActive(): boolean {
    return false;
  }

  @pushMethodCallInfoToCalled
  public log(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public notifyWhenAttacked(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public onBuildComplete(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public send(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public onWork(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public addTask(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public add(): string {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public removeByType(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public remove(): string {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public show(): string {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public balancePower(): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_NAME_EXISTS | ERR_NOT_FOUND {
    return undefined;
  }
}
