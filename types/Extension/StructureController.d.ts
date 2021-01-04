interface StructureController {
  // 检查房间内敌人是否有威胁
  checkEnemyThreat(): boolean;
  getUpgradePos(creep: Creep): RoomPosition;
}
