interface ICreepStage {
  isNeed?: (room: Room, creepName: string, preMemory: CreepMemory) => boolean;
  prepare?: (creep: Creep) => boolean;
  source?: (creep: Creep) => boolean;
  target?: (creep: Creep) => boolean;
}
