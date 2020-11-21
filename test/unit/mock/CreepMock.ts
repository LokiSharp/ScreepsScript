import RoomObjectMock from "./RoomObjectMock";

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

  public isDoing: string;

  public attack(target: AnyCreep | Structure): CreepActionReturnCode {
    this.isDoing = `log ${target.toString()}`;
    return OK;
  }
  public attackController(target: StructureController): CreepActionReturnCode {
    this.isDoing = `attackController ${target.toString()}`;
    return OK;
  }
  public build(target: ConstructionSite): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH {
    this.isDoing = `build ${target.toString()}`;
    return OK;
  }
  public cancelOrder(methodName: string): OK | ERR_NOT_FOUND {
    this.isDoing = `cancelOrder ${methodName.toString()}`;
    return OK;
  }
  public claimController(target: StructureController): CreepActionReturnCode | ERR_FULL | ERR_GCL_NOT_ENOUGH {
    this.isDoing = `claimController ${target.toString()}`;
    return OK;
  }
  public dismantle(target: Structure): CreepActionReturnCode {
    this.isDoing = `dismantle ${target.toString()}`;
    return OK;
  }
  public drop(
    resourceType: ResourceConstant,
    amount?: number
  ): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NOT_ENOUGH_RESOURCES {
    this.isDoing = `drop ${resourceType.toString()} ${amount.toString()}`;
    return OK;
  }
  public generateSafeMode(target: StructureController): CreepActionReturnCode {
    this.isDoing = `generateSafeMode ${target.toString()}`;
    return OK;
  }
  public getActiveBodyparts(type: BodyPartConstant): number {
    this.isDoing = `getActiveBodyparts ${type.toString()}`;
    return OK;
  }
  public harvest(target: Source | Mineral | Deposit): CreepActionReturnCode | ERR_NOT_FOUND | ERR_NOT_ENOUGH_RESOURCES {
    this.isDoing = `harvest ${target.toString()}`;
    return OK;
  }
  public heal(target: AnyCreep): CreepActionReturnCode {
    this.isDoing = `heal ${target.toString()}`;
    return OK;
  }
  public move(direction: DirectionConstant): CreepMoveReturnCode {
    this.isDoing = `move ${direction.toString()}`;
    return OK;
  }
  public moveByPath(
    path: PathStep[] | RoomPosition[] | string
  ): CreepMoveReturnCode | ERR_NOT_FOUND | ERR_INVALID_ARGS {
    this.isDoing = `moveByPath ${path.toString()}`;
    return OK;
  }
  public moveTo(
    target: RoomPosition | { pos: RoomPosition },
    opts?: MoveToOpts
  ): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    this.isDoing = `moveTo ${target.toString()} ${opts.toString()}`;
    return OK;
  }
  public notifyWhenAttacked(enabled: boolean): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_ARGS {
    this.isDoing = `notifyWhenAttacked ${enabled.toString()}`;
    return OK;
  }
  public pickup(target: Resource): CreepActionReturnCode | ERR_FULL {
    this.isDoing = `pickup ${target.toString()}`;
    return OK;
  }
  public pull(target: Creep): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE | ERR_NO_BODYPART {
    this.isDoing = `pull ${target.toString()}`;
    return OK;
  }
  public rangedAttack(target: AnyCreep | Structure): CreepActionReturnCode {
    this.isDoing = `rangedAttack ${target.toString()}`;
    return OK;
  }
  public rangedHeal(target: AnyCreep): CreepActionReturnCode {
    this.isDoing = `rangedHeal ${target.toString()}`;
    return OK;
  }
  public rangedMassAttack(): OK | ERR_NOT_OWNER | ERR_BUSY | ERR_NO_BODYPART {
    this.isDoing = `rangedMassAttack`;
    return OK;
  }
  public repair(target: Structure): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES {
    this.isDoing = `repair ${target.toString()}`;
    return OK;
  }
  public reserveController(target: StructureController): CreepActionReturnCode {
    this.isDoing = `reserveController ${target.toString()}`;
    return OK;
  }
  public say(message: string, toPublic?: boolean): OK | ERR_NOT_OWNER | ERR_BUSY {
    this.isDoing = `say ${message.toString()} ${toPublic.toString()}`;
    return OK;
  }
  public signController(
    target: StructureController,
    text: string
  ): OK | ERR_BUSY | ERR_INVALID_TARGET | ERR_NOT_IN_RANGE {
    this.isDoing = `signController ${target.toString()} ${text.toString()}`;
    return OK;
  }
  public suicide(): OK | ERR_NOT_OWNER | ERR_BUSY {
    this.isDoing = `suicide`;
    return OK;
  }
  public transfer(target: AnyCreep | Structure, resourceType: ResourceConstant, amount?: number): ScreepsReturnCode {
    this.isDoing = `transfer ${target.toString()} ${resourceType.toString()} ${amount.toString()}`;
    return OK;
  }
  public upgradeController(target: StructureController): ScreepsReturnCode {
    this.isDoing = `upgradeController ${target.toString()}`;
    return OK;
  }
  public withdraw(
    target: Structure | Tombstone | Ruin,
    resourceType: ResourceConstant,
    amount?: number
  ): ScreepsReturnCode {
    this.isDoing = `move ${target.toString()} ${resourceType.toString()} ${amount.toString()}`;
    return OK;
  }

  public log(content: string, color?: Colors, notify?: boolean): void {
    this.isDoing = `log ${content} ${color} ${notify.toString()}`;
  }
  public work(): void {
    this.isDoing = "work";
  }
  public goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode {
    this.isDoing = `goTo ${target.toString()} ${moveOpt.toString()}`;
    return OK;
  }
  public setWayPoint(target: string[] | string): ScreepsReturnCode {
    this.isDoing = `setWayPoint ${target.toString()}`;
    return OK;
  }
  public getEngryFrom(target: Structure | Source): ScreepsReturnCode {
    this.isDoing = `getEngryFrom ${target.toString()}}`;
    return OK;
  }
  public transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode {
    this.isDoing = `transferTo ${target.toString()} ${RESOURCE.toString()}`;
    return OK;
  }
  public upgrade(): ScreepsReturnCode {
    this.isDoing = `upgrade`;
    return OK;
  }
  public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    this.isDoing = `buildStructure`;
    return OK;
  }
  public steadyWall(): OK | ERR_NOT_FOUND {
    this.isDoing = `steadyWall`;
    return OK;
  }
  public fillDefenseStructure(expectHits?: number): boolean {
    this.isDoing = `fillDefenseStructure ${expectHits.toString()}`;
    return true;
  }

  public getFlag(flagName: string): Flag | null {
    this.isDoing = `getFlag ${flagName.toString()}`;
    return null;
  }
  public attackFlag(flagName: string): boolean {
    this.isDoing = `attackFlag ${flagName.toString()}`;
    return true;
  }
  public healTo(creep: Creep): void {
    this.isDoing = `healTo ${creep.toString()}`;
  }
  public dismantleFlag(flagName: string, healerName?: string): boolean {
    this.isDoing = `dismantleFlag ${flagName.toString()} ${healerName.toString()}`;
    return true;
  }
}
