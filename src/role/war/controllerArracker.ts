import calcBodyPart from "@/utils/creep/calcBodyPart";
import { inPlaceBase } from "@/utils/creep/inPlaceBase";

/**
 * 占领者
 */
export const controllerArracker: CreepConfig<"controllerArracker"> = {
  isNeed: (room, preMemory) => preMemory.data.keepSpawn,
  ...inPlaceBase(),
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
          range: 0
        });
      } else {
        creep.goTo(new RoomPosition(25, 25, targetRoomName));
      }

      return false;
    }
    // 进入房间之后运行基地选址规划
    else return true;
  },
  target: creep => {
    // 获取控制器
    const controller = creep.room.controller;
    if (!controller) {
      creep.say("控制器呢？");
      return false;
    }

    if (
      (controller.owner && controller.owner.username !== creep.owner.username) ||
      controller.reservation !== undefined
    ) {
      if (creep.attackController(controller) === ERR_NOT_IN_RANGE) creep.moveTo(controller);
      return false;
    } else return true;
  },
  bodys: () => calcBodyPart({ [MOVE]: 25, [CLAIM]: 15 })
};
