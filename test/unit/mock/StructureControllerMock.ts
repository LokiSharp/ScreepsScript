import RoomObjectMock from "./RoomObjectMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class StructureControllerMock extends RoomObjectMock {
  public hits: number;
  public hitsMax: number;
  public id: Id<this>;
  public isPowerEnabled: boolean;
  public level: number;
  public my: boolean;
  public owner: Owner | undefined;
  public progress: number;
  public progressTotal: number;
  public readonly prototype: StructureController;
  public reservation: ReservationDefinition | undefined;
  public safeMode?: number;
  public safeModeCooldown?: number;
  public safeModeAvailable: number;
  public sign: SignDefinition | undefined;
  public structureType: STRUCTURE_CONTROLLER;
  public ticksToDowngrade: number;
  public upgradeBlocked: number;

  @pushMethodCallInfoToCalled
  public activateSafeMode(): ScreepsReturnCode {
    return undefined;
  }

  @pushMethodCallInfoToCalled
  public checkEnemyThreat(): boolean {
    return false;
  }

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
  public unclaim(): ScreepsReturnCode {
    return undefined;
  }
}
