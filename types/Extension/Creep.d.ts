/**
 * Creep 拓展
 * 来自于 mount.creep.ts
 */
interface Creep<Role extends CreepRoleConstant = CreepRoleConstant> {
  memory: CreepMemory<Role>;

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

  rangedAttackLowestHitsHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND;
  rangedAttackNearestHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND;
  rangedAttackLowestHitsHostileStructures(): OK | ERR_NOT_FOUND;
  rangedAttackNearHostileStructures(): OK | ERR_NOT_FOUND;

  getHostileCreepsWithCache(hard?: boolean): AnyCreep[];
  getHostileStructuresWithCache(hard?: boolean): Structure<StructureConstant>[];
}
