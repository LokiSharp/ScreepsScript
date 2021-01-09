/**
 * 重占领者，刷 RCL 用
 */
export const reClaimer: CreepConfig<"reClaimer"> = {
  // 该 creep 死了不会再次孵化
  isNeed: () => false,
  // 向指定房间移动，这里移动是为了避免 target 阶段里 controller 所在的房间没有视野
  prepare: creep => {
    const { targetRoomName, wayPoint } = creep.memory.data;
    if (wayPoint && !creep.memory.fromShard) {
      creep.setWayPoint(wayPoint);
      creep.memory.fromShard = Game.shard.name as ShardName;
    }

    // 只要进入房间则准备结束
    if (creep.room.name !== targetRoomName) {
      if (wayPoint && creep.memory.fromShard) {
        creep.goTo(undefined, {
          checkTarget: true,
          range: 0
        });
      } else {
        creep.goTo(new RoomPosition(25, 25, targetRoomName));
      }

      return false;
    } else {
      return true;
    }
  },
  target: creep => {
    const { targetRoomName } = creep.memory.data;
    // 获取控制器
    const { controller, storage, terminal } = creep.room;
    if (!controller) {
      creep.say("控制器呢？");
      return false;
    }

    if (
      creep.room.name === targetRoomName &&
      creep.room.memory.canReClaim &&
      controller.level >= 8 &&
      storage.store.getUsedCapacity(RESOURCE_ENERGY) + terminal.store.getUsedCapacity(RESOURCE_ENERGY) >= 1000000
    ) {
      controller.unclaim();
      return false;
    }

    // 是中立控制器，进行占领
    const claimResult = creep.claimController(controller);
    if (claimResult === ERR_NOT_IN_RANGE) creep.goTo(controller.pos);
    else if (claimResult === OK) {
      // 任务完成，一路顺风
      creep.suicide();
    } else if (claimResult === ERR_GCL_NOT_ENOUGH) creep.log(`CCL 不足，无法占领`);
    else {
      creep.say(`占领 ${claimResult}`);
      return true;
    }
    return false;
  },
  bodys: () => [MOVE, CLAIM]
};
