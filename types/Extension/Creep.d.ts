/**
 * Creep 拓展
 * 来自于 mount.creep.ts
 */
interface Creep {
  _id: Id<Creep>;

  log(content: string, color?: Colors, notify?: boolean): void;
  work(): void;
  goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode;
  setWayPoint(target: string[] | string): ScreepsReturnCode;
  getEngryFrom(target: Structure | Source): ScreepsReturnCode;
  transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode;
  upgrade(): ScreepsReturnCode;
  buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND;
  steadyWall(): OK | ERR_NOT_FOUND;
  fillDefenseStructure(expectHits?: number): boolean;

  getFlag(flagName: string): Flag | null;
  attackFlag(flagName: string): boolean;
  healTo(creep: Creep): void;
  dismantleFlag(flagName: string, healerName?: string): boolean;
}
