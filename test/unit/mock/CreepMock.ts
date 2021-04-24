import { RoomObjectMock } from "./RoomObjectMock";
import { getMock } from "@mock/utils";
import { getMockRoom } from "@mock/RoomMock";
import { pushMethodCallInfoToCalled } from "@mock/pushMethodCallInfoToCalled";

export class CreepMock extends RoomObjectMock {
  public body = [{ type: MOVE, hits: 100 }];
  public fatigue = 0;
  public hits = 100;
  public hitsMax = 100;
  public name = this.id;
  public room = getMockRoom({ name: "W1N1" });
  public spawning = false;
  public saying: string;
  public store: StoreDefinition;
  public ticksToLive = 1500;

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
  public upgradeRoom(): ScreepsReturnCode {
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
  @pushMethodCallInfoToCalled
  public getHostileCreepsWithCache(): AnyCreep[] {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public getHostileStructuresWithCache(): Structure<StructureConstant>[] {
    return undefined;
  }
}

/**
 * 伪造一个 Creep
 * @param props 属性
 */
export const getMockCreep = getMock<Creep>(CreepMock);
