interface RoomPosition {
  directionToPos(direction: DirectionConstant): RoomPosition | undefined;
  getFreeSpace(): RoomPosition[];
}
