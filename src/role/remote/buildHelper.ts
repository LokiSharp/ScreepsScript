import { bodyConfigs } from "setting";
import createBodyGetter from "utils/creep/createBodyGetter";
import { getRoomAvailableSource } from "../../modules/energyController";

/**
 * 协助建造者
 * 协助其他玩家进行建造工作
 */
export const buildHelper: CreepConfig<"buildHelper"> = {
  // 向指定房间移动
  prepare: creep => {
    const { targetRoomName, wayPoint } = creep.memory.data;
    // 设定路径点
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
      delete creep.memory.moveInfo;
      return true;
    }
  },
  // 下面是正常的建造者逻辑
  source: creep => {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

    // 获取有效的能量来源
    let source: AllEnergySource;
    if (!creep.memory.sourceId) {
      source = getRoomAvailableSource(creep.room);
      if (!source) {
        creep.say("没能量了，歇会");
        return false;
      }

      creep.memory.sourceId = source.id;
    } else source = Game.getObjectById(creep.memory.sourceId);
    // 之前的来源建筑里能量不够了就更新来源
    if (
      !source ||
      (source instanceof Structure && source.store[RESOURCE_ENERGY] < 300) ||
      (source instanceof Source && source.energy === 0) ||
      (source instanceof Ruin && source.store[RESOURCE_ENERGY] === 0)
    )
      delete creep.memory.sourceId;

    creep.getEngryFrom(source);
    return false;
  },
  target: creep => {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (target) {
      if (creep.build(target) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
      }
    }

    return creep.store.getUsedCapacity() === 0;
  },
  bodys: createBodyGetter(bodyConfigs.remoteHelper)
};
