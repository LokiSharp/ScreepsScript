/**
 * 战斗 creep 基础阶段
 * 本方法抽象出了战斗 Creep 通用的 source 阶段和 switch 阶段
 *
 * @param flagName 目标旗帜名称
 */
export const battleBase = (flagName: string, keepSpawn: boolean): ICreepStage => ({
  // 根据玩家配置决定是否持续生成
  isNeed: () => keepSpawn,
  /**
   * 获取旗帜，然后向指定房间移动
   * 同时保证自己的健康状态
   */
  source: (creep: Creep) => {
    if (creep.memory.moveInfo && creep.memory.moveInfo.wayPoints) {
      creep.goTo(undefined, {
        checkTarget: true,
        range: 0
      });

      if (creep.memory.moveInfo && creep.memory.moveInfo.wayPoints && creep.memory.moveInfo.wayPoints.length <= 1) {
        const targetFlag = creep.getFlag(flagName);

        if (creep.room.name === targetFlag.pos.roomName) {
          creep.log(`抵达指定房间，切入作战模式`, "green");
          delete creep.memory.moveInfo.wayPoints;
          return true;
        }
      }
    } else {
      const targetFlag = creep.getFlag(flagName);
      if (!targetFlag) {
        creep.say("旗呢?");
        return false;
      }

      // 远程移动
      creep.goTo(targetFlag.pos, { checkTarget: true });
      creep.say("🛴", true);

      if (creep.room.name === targetFlag.pos.roomName) {
        creep.log(`抵达指定房间，切入作战模式`, "green");
        return true;
      }
    }

    // 保证自己血量健康（兼容没有 HEAL 的 creep）
    if (creep.hits < creep.hitsMax && creep.getActiveBodyparts(HEAL)) {
      creep.heal(creep);
      creep.say("💔", true);
    }

    return false;
  }
});
