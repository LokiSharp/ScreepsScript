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
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public attackController(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public build(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public cancelOrder(): OK | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public claimController(): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public dismantle(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public drop(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public generateSafeMode(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public getActiveBodyparts(): number {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public harvest(): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public heal(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public move(): CreepMoveReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public moveByPath(): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public moveTo(): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public notifyWhenAttacked(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public pickup(): CreepActionReturnCode | ERR_FULL {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public pull(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedAttack(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedHeal(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public repair(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public reserveController(): CreepActionReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public say(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public signController(): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public suicide(): OK | ERR_NOT_OWNER | ERR_BUSY {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public transfer(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public upgradeController(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public withdraw(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public log(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public OnWork(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public goTo(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public setWayPoint(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public getEngryFrom(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public transferTo(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public upgrade(): ScreepsReturnCode {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public steadyWall(): OK | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public fillDefenseStructure(): boolean {
    return false;
  }
  @pushMethodCallInfoToCalled
  public getFlag(): Flag | null {
    return null;
  }
  @pushMethodCallInfoToCalled
  public attackFlag(): boolean {
    return false;
  }
  @pushMethodCallInfoToCalled
  public healTo(): void {
    // PASS
  }
  @pushMethodCallInfoToCalled
  public dismantleFlag(): boolean {
    return false;
  }

  @pushMethodCallInfoToCalled
  public rangedAttackLowestHitsHostileCreeps(): OK | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedAttackNearestHostileCreeps(): OK | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedAttackLowestHitsHostileStructures(): OK | ERR_NOT_FOUND {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public rangedAttackNearHostileStructures(): OK | ERR_NOT_FOUND {
    return undefined;
  }

  public getHostileCreepsWithCache(): AnyCreep[] {
    return undefined;
  }
  public getHostileStructuresWithCache(): Structure<StructureConstant>[] {
    return undefined;
  }
}
