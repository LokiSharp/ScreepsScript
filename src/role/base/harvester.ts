import { HARVEST_MODE, bodyConfigs } from "@/setting";
import { addConstructionSite } from "@/modules/ConstructionController";
import calcBodyPart from "@/utils/creep/calcBodyPart";
import createBodyGetter from "@/utils/creep/createBodyGetter";

/**
 * 设置采集状态
 * @param creep 执行移动的单位
 * @param source 目标
 */
const setHarvestMode = function (creep: Creep, source: Source): void {
  // 外矿就采集了运到家
  if (!source.room.controller || source.room.controller.level <= 0) {
    creep.memory.harvestMode = HARVEST_MODE.START;
    return;
  }

  // 有 link 就往里运
  const nearLink = source.getLink();
  if (nearLink) {
    creep.memory.harvestMode = HARVEST_MODE.TRANSPORT;
    creep.memory.targetId = nearLink.id;
    return;
  }

  // 有 container 就往上走
  const nearContainer = source.getContainer();
  if (nearContainer) {
    creep.memory.harvestMode = HARVEST_MODE.SIMPLE;
    creep.memory.targetId = nearContainer.id;
    return;
  }

  // 啥都没有就启动模式
  creep.memory.harvestMode = HARVEST_MODE.START;
};

/**
 * 移动到 source 旁丢弃能量的位置
 * @param creep 执行移动的单位
 * @param source 目标
 */
const goToDropPos = function (
  creep: Creep<"harvester">,
  source: Source
): {
  // 本次移动的返回值
  result: ScreepsReturnCode;
  // 移动的目的地（之前没有丢弃位置的话目标就为 source，否则为对应的能量丢弃位置）
  targetPos: RoomPosition;
  // 要移动到的范围
  range: number;
} {
  let targetPos: RoomPosition;
  let range = 0;

  // 尝试从缓存里读位置
  const { standPos } = creep.memory.data;
  if (standPos) {
    const [roomName, x, y] = creep.memory.data.standPos.split(",");
    targetPos = new RoomPosition(Number(x), Number(y), roomName);
  } else {
    const { pos: droppedPos } = source.getDroppedInfo();
    // 之前就已经有点位了，自己保存一份
    if (droppedPos) {
      const { roomName, x, y } = droppedPos;
      creep.memory.data.standPos = `${roomName},${x},${y}`;
    }
    // 没有点位的话就要移动到 source，调整移动范围
    else range = 1;

    targetPos = droppedPos ? droppedPos : source.pos;
  }

  // 执行移动
  const result = creep.goTo(targetPos, { range });
  return { result, targetPos, range };
};

/**
 * 采集单位不同模式下的行为
 */
const actionStrategy: ActionStrategy = {
  /**
   * 启动模式
   *
   * 当房间内没有搬运工时，采集能量，填充 spawn 跟 extension
   * 当有搬运工时，无脑采集能量
   */
  [HARVEST_MODE.START]: {
    prepare: (creep, source) => {
      const { targetPos, range } = goToDropPos(creep, source);

      // 没有抵达位置就准备未完成
      if (!creep.pos.inRangeTo(targetPos, range)) return false;

      // 启动模式下，走到之后就将其设置为能量丢弃点
      source.setDroppedPos(creep.pos);

      // 把该位置存缓存到自己内存
      const { roomName, x, y } = creep.pos;
      creep.memory.data.standPos = `${roomName},${x},${y}`;

      // 如果脚下没有 container 及工地的话就放工地并发布建造任务
      const getContainerFilter = (s: Structure | ConstructionSite) => s.structureType === STRUCTURE_CONTAINER;
      const posContinaer = creep.pos.lookFor(LOOK_STRUCTURES).filter(getContainerFilter);
      const posContinaerSite = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES).filter(getContainerFilter);

      if (posContinaer.length <= 0 && posContinaerSite.length <= 0) {
        addConstructionSite([{ pos: creep.pos, type: STRUCTURE_CONTAINER }]);
        creep.room.work.addTask({ type: "buildStartContainer", sourceId: source.id });
        creep.log(`发布 source ${source.id} 的 container 建造任务`, "green");
      }

      return true;
    },
    source: (creep, source) => {
      const useRoom = Game.rooms[creep.memory.data.useRoom];
      if (!useRoom) return false;

      // 如果有搬运工了就无脑采集
      if (useRoom.transport.getUnit().length <= 0 && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

      const result = creep.harvest(source);
      if (result === ERR_NOT_IN_RANGE) goToDropPos(creep, source);
      return false;
    },
    target: creep => {
      const useRoom = Game.rooms[creep.memory.data.useRoom];
      if (!useRoom) return false;

      // 有运输工了就回去挖能量
      if (creep.store[RESOURCE_ENERGY] <= 0 || useRoom.transport.getUnit().length > 0) return true;

      // 找到 spawn 然后把身上的能量全塞进去，不搜索 extension，因为启动时还没有 extension
      // 就算是重建，只要保证 spawn 里有能量也能孵化搬运工了
      const targetSpawn =
        useRoom[STRUCTURE_SPAWN].find(spawn => {
          return spawn.store[RESOURCE_ENERGY] < SPAWN_ENERGY_CAPACITY;
        }) || useRoom[STRUCTURE_SPAWN][0];

      if (!targetSpawn) {
        creep.say("😨卧槽我家没了");
        return false;
      }

      creep.goTo(targetSpawn.pos, { range: 1 });
      creep.transferTo(targetSpawn, RESOURCE_ENERGY);
      return false;
    }
  },

  /**
   * 简单模式
   *
   * 在 container 不存在时切换为启动模式
   * 往 container 移动 > 检查 container 状态 > 无脑采集
   */
  [HARVEST_MODE.SIMPLE]: {
    prepare: (creep, source) => {
      const container = source.getContainer();
      if (!container) {
        creep.memory.harvestMode = HARVEST_MODE.START;
        return false;
      }

      creep.goTo(container.pos, { range: 0 });
      // 没抵达位置了就还没准备完成
      if (!creep.pos.inRangeTo(container, 0)) return false;

      // container 掉血了就发布维修任务
      if (container.hits < container.hitsMax) {
        const useRoom = Game.rooms[creep.memory.data.useRoom];
        if (!useRoom) return false;
        useRoom.work.updateTask({ type: "repair", priority: 9 }, { dispath: true });
      }

      return true;
    },
    /**
     * 简单模式没有 source 阶段
     */
    source: () => true,
    /**
     * 采集阶段会无脑采集，过量的能量会掉在 container 上然后被接住存起来
     */
    target: creep => {
      const { sourceId } = creep.memory.data;
      creep.getEngryFrom(Game.getObjectById(sourceId));

      // 快死了就把身上的能量丢出去，这样就会存到下面的 container 里，否则变成墓碑后能量无法被 container 自动回收
      if (creep.ticksToLive < 2) creep.drop(RESOURCE_ENERGY);
      return false;
    }
  },

  /**
   * 转移模式
   *
   * 在 link 不存在时切换为启动模式
   * 采集能量 > 存放到指定建筑
   */
  [HARVEST_MODE.TRANSPORT]: {
    prepare: () => true,
    source: (creep, source) => {
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) return true;

      creep.getEngryFrom(source);

      if (source.energy < source.energyCapacity / 2) {
        // 如果满足下列条件就重新发送 regen_source 任务
        if (
          // creep 允许重新发布任务
          (!creep.memory.regenSource || creep.memory.regenSource < Game.time) &&
          // source 上没有效果
          (!source.effects || !source.effects[PWR_REGEN_SOURCE])
        ) {
          // 并且房间内的 pc 支持这个任务
          if (creep.room.memory.powers && creep.room.memory.powers.split(" ").includes(String(PWR_REGEN_SOURCE))) {
            // 添加 power 任务，设置重新尝试时间
            creep.room.addPowerTask(PWR_REGEN_SOURCE);
            creep.memory.regenSource = Game.time + 300;
          } else creep.memory.regenSource = Game.time + 1000;
        }
      }

      // 快死了就把能量移出去
      return creep.ticksToLive < 2;
    },
    target: creep => {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return true;

      const target = Game.getObjectById(creep.memory.targetId as Id<StructureLink>) || creep.room.storage;

      // 目标没了，变更为启动模式
      if (!target) {
        delete creep.memory.targetId;
        creep.memory.harvestMode = HARVEST_MODE.START;
        return true;
      }

      return creep.transferTo(target, RESOURCE_ENERGY) === OK;
    }
  }
};

/**
 * 采集者
 * 从指定 source 中获取能量 > 将能量存放到身下的 container 中
 */
export const harvester: CreepConfig<"harvester"> = {
  prepare: creep => {
    const { harvestRoom, sourceId } = creep.memory.data;
    if (creep.room.name !== harvestRoom) {
      creep.goTo(new RoomPosition(25, 25, harvestRoom));
      return false;
    }
    const source = Game.getObjectById(sourceId);

    // 设置采集模式
    if (!creep.memory.harvestMode) setHarvestMode(creep, source);

    // 执行各自的准备逻辑
    return actionStrategy[creep.memory.harvestMode].prepare(creep, source);
  },

  source: creep => {
    const source = Game.getObjectById(creep.memory.data.sourceId);
    return actionStrategy[creep.memory.harvestMode].source(creep, source);
  },

  target: creep => {
    return actionStrategy[creep.memory.harvestMode].target(creep);
  },

  bodys: (room, spawn, data) => {
    const source = Game.getObjectById(data.sourceId);

    // 如果没视野或者边上没有 Link 的话，就用 harvester 标准的部件
    return !source || !source.getLink()
      ? createBodyGetter(bodyConfigs.harvester)(room, spawn)
      : calcBodyPart({ [WORK]: 16, [CARRY]: 4, [MOVE]: 8 });
  }
};

type ActionStrategy = {
  [key in HarvestMode]: {
    prepare: (creep: Creep<"harvester">, source: Source) => boolean;
    source: (creep: Creep<"harvester">, source: Source) => boolean;
    target: (creep: Creep<"harvester">) => boolean;
  };
};
