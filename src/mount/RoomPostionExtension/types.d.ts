interface RoomPosition {
  directionToPos(direction: DirectionConstant): RoomPosition | undefined;

  getFreeSpace(range?: number): RoomPosition[];

  getCanStandPos(range?: number): RoomPosition[];

  hasCreepStand(): boolean;

  canStand(): boolean;
}
