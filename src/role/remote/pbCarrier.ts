import { PB_HARVEST_STATE } from "@/setting";
import calcBodyPart from "@/utils/creep/calcBodyPart";

/**
 * 外矿采集者
 * 从指定矿中挖矿 > 将矿转移到建筑中
 */
export const pbCarrier: CreepConfig<"pbCarrier"> = {
  // carrier 并不会重复生成
  isNeed: () => false,
  // 移动到目标三格之内就算准备完成
  prepare: creep => {
    const { sourceFlagName } = creep.memory.data;
    const targetFlag = Game.flags[sourceFlagName];
    if (!targetFlag) {
      creep.suicide();
      return false;
    }

    creep.goTo(targetFlag.pos);

    return creep.pos.inRangeTo(targetFlag.pos, 3);
  },
  source: creep => {
    const { sourceFlagName } = creep.memory.data;
    const targetFlag = Game.flags[sourceFlagName];
    if (!targetFlag) {
      creep.suicide();
      return false;
    }
    // 没到搬运的时候就先待命
    if (targetFlag.memory.state !== PB_HARVEST_STATE.TRANSFER) return false;
    // 到行动阶段了就过去
    creep.goTo(targetFlag.pos);

    // 到房间里再进行下一步操作
    if (creep.room.name !== targetFlag.pos.roomName) return false;

    // 获取 powerBank 的废墟
    const powerbankRuin: Ruin = targetFlag.pos.lookFor(LOOK_RUINS)[0];

    // 如果 pb 废墟还存在
    if (powerbankRuin) {
      if (creep.withdraw(powerbankRuin, RESOURCE_POWER) === OK) return true;
    }
    // 如果废墟没了就从地上捡
    else {
      const power = targetFlag.pos.lookFor(LOOK_RESOURCES)[0];
      if (power) {
        if (creep.pickup(power) === OK) return true;
      }
      // 地上也没了那就上天堂
      else creep.suicide();
      targetFlag.remove();
    }
    return false;
  },
  target: creep => {
    const {
      spawnRoom: spawnRoomName,
      data: { sourceFlagName }
    } = creep.memory;
    // 获取资源运输目标房间并兜底
    const room = Game.rooms[spawnRoomName];
    if (!room || !room.terminal) {
      creep.log(`找不到 terminal`, "yellow");
      return false;
    }

    // 存放资源
    const result = creep.transferTo(room.terminal, RESOURCE_POWER);
    // 存好了就直接自杀并移除旗帜
    if (result === OK) {
      creep.suicide();

      const targetFlag = Game.flags[sourceFlagName];
      if (!targetFlag) return false;

      targetFlag.remove();
      // 通知 terminal 进行 power 平衡
      room.terminal.balancePower();

      return true;
    }
    return false;
  },
  bodys: () => calcBodyPart({ [CARRY]: 32, [MOVE]: 16 })
};
