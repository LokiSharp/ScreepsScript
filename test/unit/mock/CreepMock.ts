import RoomObjectMock from "./RoomObjectMock";
import { pushMethodNameToCalled } from "./pushMethodNameToCalled";
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

  @pushMethodNameToCalled
  public attack(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public attackController(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public build(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH {
    return OK;
  }
  @pushMethodNameToCalled
  public cancelOrder(): OK | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodNameToCalled
  public claimController(): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH {
    return OK;
  }
  @pushMethodNameToCalled
  public dismantle(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public drop(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodNameToCalled
  public generateSafeMode(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public getActiveBodyparts(): number {
    return OK;
  }
  @pushMethodNameToCalled
  public harvest(): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodNameToCalled
  public heal(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public move(): CreepMoveReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public moveByPath(): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodNameToCalled
  public moveTo(): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodNameToCalled
  public notifyWhenAttacked(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodNameToCalled
  public pickup(): CreepActionReturnCode | ERR_FULL {
    return OK;
  }
  @pushMethodNameToCalled
  public pull(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART {
    return OK;
  }
  @pushMethodNameToCalled
  public rangedAttack(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public rangedHeal(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
    return OK;
  }
  @pushMethodNameToCalled
  public repair(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodNameToCalled
  public reserveController(): CreepActionReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public say(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return OK;
  }
  @pushMethodNameToCalled
  public signController(): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
    return OK;
  }
  @pushMethodNameToCalled
  public suicide(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return OK;
  }
  @pushMethodNameToCalled
  public transfer(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public upgradeController(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public withdraw(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public log(): void {
    // PASS
  }
  @pushMethodNameToCalled
  public work(): void {
    // PASS
  }
  @pushMethodNameToCalled
  public goTo(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public setWayPoint(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public getEngryFrom(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public transferTo(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public upgrade(): ScreepsReturnCode {
    return OK;
  }
  @pushMethodNameToCalled
  public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodNameToCalled
  public steadyWall(): OK | ERR_NOT_FOUND {
    return OK;
  }
  @pushMethodNameToCalled
  public fillDefenseStructure(): boolean {
    return true;
  }
  @pushMethodNameToCalled
  public getFlag(): Flag | null {
    return null;
  }
  @pushMethodNameToCalled
  public attackFlag(): boolean {
    return true;
  }
  @pushMethodNameToCalled
  public healTo(): void {
    // PASS
  }
  @pushMethodNameToCalled
  public dismantleFlag(): boolean {
    return true;
  }
}
