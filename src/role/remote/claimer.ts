import { getName } from "@/utils/global/getName";

/**
 * 占领者
 */
export const claimer: CreepConfig<"claimer"> = {
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
    }
    // 进入房间之后运行基地选址规划
    else {
      // 用户没有指定旗帜时才会运行自动规划
      if (!(getName.flagBaseCenter(creep.room.name) in Game.flags)) creep.room.findBaseCenterPos();

      return true;
    }
  },
  target: creep => {
    // 获取控制器
    const controller = creep.room.controller;
    if (!controller) {
      creep.say("控制器呢？");
      return false;
    }

    // 绘制所有基地中央待选点位
    creep.room.memory.centerCandidates?.forEach(center => creep.room.visual.circle(...center));

    // 如果控制器不是自己或者被人预定的话就进行攻击
    if (
      (controller.owner && controller.owner.username !== creep.owner.username) ||
      controller.reservation !== undefined
    ) {
      if (creep.attackController(controller) === ERR_NOT_IN_RANGE) creep.moveTo(controller);
      return false;
    }

    // 是中立控制器，进行占领
    const claimResult = creep.claimController(controller);
    if (claimResult === ERR_NOT_IN_RANGE) creep.goTo(controller.pos);
    else if (claimResult === OK) {
      const { targetRoomName, signText, spawnRoom: spawnRoomName, wayPoint } = creep.memory.data;
      creep.log(`新房间 ${targetRoomName} 占领成功！已向源房间 ${spawnRoomName} 请求支援单位`, "green");

      // 占领成功，发布支援组
      const spawnRoom = Game.rooms[spawnRoomName];
      if (spawnRoom) {
        if (wayPoint) {
          spawnRoom.release.remoteHelper(targetRoomName, wayPoint);
        } else {
          spawnRoom.release.remoteHelper(targetRoomName);
        }
      }

      // 添加签名
      if (signText) creep.signController(controller, signText);

      const flag = Game.flags[getName.flagBaseCenter(creep.room.name)];
      // 用户已经指定了旗帜了
      if (flag) {
        creep.room.setBaseCenter(flag.pos);
        creep.log(`使用玩家提供的基地中心点，位置 [${flag.pos.x}, ${flag.pos.y}]`, "green");
        // 移除旗帜
        flag.remove();
      }
      // 运行基地选址确认
      else {
        if (creep.room.memory.centerCandidates.length <= 0) {
          creep.log(
            `房间中未找到有效的基地中心点，请放置旗帜并执行 Game.rooms.${creep.room.name}.setcenter('旗帜名')`,
            "red"
          );
        } else {
          const result = creep.room.confirmBaseCenter();
          if (result === ERR_NOT_FOUND) creep.log(`新的基地中心点确认失败，请手动指定`, "yellow");
          else creep.log(`新的基地中心点已确认, 位置 [${result.x}, ${result.y}]`, "green");
        }
      }

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
