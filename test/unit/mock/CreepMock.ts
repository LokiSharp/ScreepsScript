import RoomObjectMock from "./RoomObjectMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";
export default class CreepMock extends RoomObjectMock {
  public constructor(id: Id<CreepMock>, x: number, y: number) {
    super(x, y);
    this.id = id;
  }

  public body: BodyPartDefinition[];
  public carry: StoreDefinition;
  public carryCapacity: number;
  public fatigue: number;
  public hits: number;
  public hitsMax: number;
  public id: Id<CreepMock>;
  public memory: CreepMemory;
  public my: boolean;
  public name: string;
  public owner: Owner;
  public room: Room;
  public spawning: boolean;
  public saying: string;
  public store: StoreDefinition;
  public ticksToLive: number | undefined;

  @pushMethodCallInfoToCalled
  public attack(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public attackController(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public build(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public cancelOrder(): OK | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public claimController(): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public dismantle(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public drop(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public generateSafeMode(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public getActiveBodyparts(): number {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public harvest(): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public heal(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public move(): CreepMoveReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public moveByPath(): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public moveTo(): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public notifyWhenAttacked(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public pickup(): CreepActionReturnCode | ERR_FULL {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public pull(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public rangedAttack(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public rangedHeal(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public repair(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public reserveController(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public say(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public signController(): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public suicide(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public transfer(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public upgradeController(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public withdraw(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public log(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public work(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public goTo(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public setWayPoint(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public getEngryFrom(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public transferTo(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public upgrade(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public steadyWall(): OK | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public fillDefenseStructure(): boolean {
    return true;
  }
  @pushMethodCallInfoToCalled
  public getFlag(): Flag | null {
    return null;
  }
  @pushMethodCallInfoToCalled
  public attackFlag(): boolean {
    return true;
  }
  @pushMethodCallInfoToCalled
  public healTo(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public dismantleFlag(): boolean {
    return true;
  }
}
