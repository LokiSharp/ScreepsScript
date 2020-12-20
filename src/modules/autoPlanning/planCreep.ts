import { FILLER_WITH_CONTAINER_RANGE, MAX_HARVESTER_NUM, MAX_UPGRADER_NUM, UPGRADE_WITH_STORAGE } from "setting";
import { creepApi } from "modules/creepController/creepApi";

// 在 Function 原型上挂载 setNextPlan 方法来完成 creep 发布的职责链
declare global {
  interface Function {
    setNextPlan(nextPlan: PlanNodeFunction): PlanNodeFunction;
  }
}

/**
 * AOP 创建切面
 * 在发布计划返回 false 时执行下一个计划
 *
 * @param nextPlan 该发布计划不适用时要执行的下一个计划
 */
Function.prototype.setNextPlan = function (nextPlan): PlanNodeFunction {
  return args => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const canExec = this(args);
    if (!canExec) return nextPlan(args);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return canExec;
  };
};

/**
 * 快捷发布 upgrader
 * @param roomName 要添加到的房间名
 * @param indexes creep 的名称后缀
 * @param sourceId 能量来源 id
 */
function addUpgrader(roomName: string, indexes: number[], sourceId: Id<EnergySourceStructure>): void {
  indexes.forEach(i =>
    creepApi.add(`${roomName} upgrader${i}`, "upgrader", { sourceId, workRoom: roomName }, roomName)
  );
}

const releasePlans: CreepReleasePlans = {
  /**
   * 发布能量采集单位的相关逻辑
   */
  harvester: {
    // 状态收集
    getStats(room: Room): HarvesterPlanStats {
      const stats: HarvesterPlanStats = {
        room,
        // 查找 source 及其身边的 link
        sources: room.source.map(source => {
          const nearLinks = source.pos.findInRange<StructureLink>(FIND_MY_STRUCTURES, 2, {
            filter: structure => structure.structureType === STRUCTURE_LINK
          });
          return {
            id: source.id,
            linkId: nearLinks.length > 0 ? nearLinks[0].id : undefined
          };
        })
      };

      // 收集 centerLink 及 storage
      if (room.centerLink) stats.centerLinkId = room.centerLink.id;
      if (room.storage) stats.storageId = room.storage.id;

      return stats;
    },
    // 发布计划
    plans: [
      // 有 storage 也有 centerLink，可以通过 sourceLink 转移能量了
      ({ room, storageId, centerLinkId, sources }: HarvesterPlanStats) => {
        if (!(storageId && centerLinkId)) return false;

        // 遍历所有 source 进行发布
        sources.forEach((sourceDetail, index) => {
          // 有对应的 sourceLink 的话 harvester 把自己的能量放进去
          if (sourceDetail.linkId) {
            creepApi.add(
              `${room.name} harvester${index}`,
              "collector",
              {
                sourceId: sourceDetail.id,
                targetId: sourceDetail.linkId
              },
              room.name
            );
            room.log(`能量将存放至 sourceLink`, "harvester", "green");
          }
          // 没有的话就还是老角色，新建 container 并采集
          else {
            creepApi.add(
              `${room.name} harvester${index}`,
              "harvester",
              {
                sourceId: sourceDetail.id
              },
              room.name
            );
            room.log(`能量将存放至 sourceContainer`, "harvester", "green");
          }
        });

        return true;
      },

      // 没有 storage，直接发布 harvester
      ({ room, sources }: HarvesterPlanStats) => {
        // 遍历所有 source 进行发布，多余能量直接存到 storage 里
        sources.forEach((sourceDetail, index) => {
          creepApi.add(
            `${room.name} harvester${index}`,
            "harvester",
            {
              sourceId: sourceDetail.id
            },
            room.name
          );
        });

        room.log(`能量将存放至 sourceContainer`, "harvester", "green");
        return true;
      }
    ]
  },

  /**
   * 发布升级单位的相关逻辑
   */
  upgrader: {
    // 状态收集
    getStats(room: Room): UpgraderPlanStats {
      const stats: UpgraderPlanStats = {
        room,
        controllerLevel: room.controller.level,
        ticksToDowngrade: room.controller.ticksToDowngrade,
        sourceContainerIds: room.memory.sourceContainersIds || [],
        upgradeLinkId: room.memory.upgradeLinkId
      };

      if (room.storage) {
        stats.storageId = room.storage.id;
        stats.storageEnergy = room.storage.store[RESOURCE_ENERGY];
      }

      if (room.terminal) {
        stats.terminalId = room.terminal.id;
        stats.terminalEnergy = room.terminal.store[RESOURCE_ENERGY];
      }

      return stats;
    },
    // 发布计划
    plans: [
      // 8 级时的特殊判断
      ({ room, controllerLevel, ticksToDowngrade, upgradeLinkId }: UpgraderPlanStats) => {
        if (controllerLevel < 8) return false;
        // 掉级还早，不发布 upgrader 了
        if (ticksToDowngrade >= 100000) return true;

        // 快掉级了就发布一个
        addUpgrader(room.name, [0], upgradeLinkId);

        return true;
      },

      // 优先用 upgradeLink
      ({ room, upgradeLinkId }: UpgraderPlanStats) => {
        if (!upgradeLinkId) return false;

        // 发布升级单位给 link
        addUpgrader(room.name, [0, 1, 2], upgradeLinkId);

        room.log("将从 upgradeLink 获取能量", "upgrader", "green");
        return true;
      },

      // 根据 storage 里的能量发布对应数量的 upgrader
      ({ room, storageId, storageEnergy }: UpgraderPlanStats) => {
        if (!storageId || storageEnergy < UPGRADE_WITH_STORAGE[UPGRADE_WITH_STORAGE.length - 1].energy) return false;

        // 遍历配置项进行 upgrader 发布
        UPGRADE_WITH_STORAGE.find(config => {
          // 找到对应的配置项了，发布对应数量的 upgrader
          if (storageEnergy > config.energy) {
            addUpgrader(
              room.name,
              new Array(config.num).fill(undefined).map((_, i) => i),
              storageId
            );
            room.log(`将从 storage 获取能量，发布数量 * ${config.num}`, "upgrader", "green");
            return true;
          } else return false;
        });

        return true;
      },

      // 兜底，从 sourceContainer 中获取能量
      ({ room, sourceContainerIds }: UpgraderPlanStats) => {
        // 有援建单位，每个 container 少发布一个 upgrader
        const upgraderIndexs = creepApi.has(`${room.name} RemoteUpgrader`) ? [0] : [0, 1];

        // 遍历所有 container，发布对应数量的 upgrader
        sourceContainerIds.forEach((containerId, index) => {
          addUpgrader(
            room.name,
            upgraderIndexs.map(i => index + i * 2),
            containerId
          );
        });

        room.log(
          `将从 sourceContainer 获取能量，发布数量 * ${sourceContainerIds.length * upgraderIndexs.length}`,
          "upgrader",
          "green"
        );
        return true;
      }
    ]
  },

  /**
   * 发布资源运输单位的相关逻辑
   */
  transporter: {
    // 状态收集
    getStats(room: Room): TransporterPlanStats {
      const stats: TransporterPlanStats = {
        room,
        sourceContainerIds: room.sourceContainers.map(container => container.id) || []
      };
      if (room.storage) stats.storageId = room.storage.id;
      if (room.centerLink) stats.centerLinkId = room.centerLink.id;
      if (room.memory) stats.centerPos = room.memory.center;

      return stats;
    },
    // 发布计划
    plans: [
      // container 修建完成
      ({ room, sourceContainerIds, centerPos }: TransporterPlanStats) => {
        let releaseNumber = 0;
        // 遍历现存的 container，发布填充单位
        // 会根据 container 到基地的距离决定发布数量
        sourceContainerIds.forEach((containerId, index) => {
          const container = Game.getObjectById(containerId);
          if (!container) return;

          // 获取 container 到基地中心的距离
          const range = centerPos
            ? container.pos.findPathTo(centerPos[0], centerPos[1]).length
            : // 没有设置基地中心点，使用第一个 spawn 的位置
              container.pos.findPathTo(room[STRUCTURE_SPAWN][0].pos.x, room[STRUCTURE_SPAWN][0].pos.y).length;

          // 根据获取合适的人数
          const numberConfig = FILLER_WITH_CONTAINER_RANGE.find(config => range > config.range);
          releaseNumber += numberConfig.num;

          // 发布对应数量的 filler
          for (let i = 0; i < numberConfig.num; i++) {
            creepApi.add(
              `${room.name} filler${index}${i}`,
              "filler",
              {
                sourceId: containerId,
                workRoom: room.name
              },
              room.name
            );
          }
        });

        room.log(`发布 filler * ${releaseNumber}`, "transporter", "green");
        // 发布并没有完成，继续检查是否可以发布 manager 和 processor
        return false;
      },

      // storage 修建完成
      ({ room, storageId }: TransporterPlanStats) => {
        if (!storageId) return true;
        if (!Game.getObjectById(storageId).my) return true;

        // 发布房间物流管理单位
        creepApi.add(
          `${room.name} manager`,
          "manager",
          {
            sourceId: storageId,
            workRoom: room.name
          },
          room.name
        );

        room.log(`发布 manager`, "transporter", "green");
        return false;
      },

      // centerLink 修建完成
      ({ room, centerLinkId, centerPos }: TransporterPlanStats) => {
        if (!centerLinkId || !centerPos) return true;

        // 发布中央运输单位
        creepApi.add(
          `${room.name} processor`,
          "processor",
          {
            x: centerPos[0],
            y: centerPos[1]
          },
          room.name
        );

        room.log(`发布 processor`, "transporter", "green");
        return true;
      }
    ]
  }
};

const planChains: { [type in keyof CreepReleasePlans]?: PlanNodeFunction } = {};
// 按照对应 plans 列表的顺序把所有角色的所有发布计划串成职责链
Object.keys(releasePlans).forEach(role => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
  planChains[role] = releasePlans[role].plans.reduce((pre, next) => pre.setNextPlan(next));
});

/**
 * 发布采集者
 * @param room 要发布角色的房间
 */
function releaseHarvester(room: Room): OK {
  // 先移除所有的配置项
  for (let i = 0; i < MAX_HARVESTER_NUM; i++) creepApi.remove(`${room.name} harvester${i}`);

  // 然后重新发布
  planChains.harvester(releasePlans.harvester.getStats(room));
  return OK;
}

/**
 * 发布运输者
 * @param room 要发布角色的房间
 */
function releaseTransporter(room: Room): OK {
  // 不需要提前移除，因为运输者的数量不会发生大范围波动
  planChains.transporter(releasePlans.transporter.getStats(room));
  return OK;
}

/**
 * 发布升级者
 * @param room 要发布角色的房间
 */
function releaseUpgrader(room: Room): OK {
  // 先移除所有的配置项
  for (let i = 0; i < MAX_UPGRADER_NUM; i++) creepApi.remove(`${room.name} upgrader${i}`);

  // 然后重新发布
  planChains.upgrader(releasePlans.upgrader.getStats(room));
  return OK;
}

/**
 * 发布建造者
 * @param room 要发布角色的房间
 * @param releaseNumber 要发布的角色数量
 */
function releaseBuilder(room: Room, releaseNumber = 2): OK {
  for (let i = 0; i < releaseNumber; i++) {
    creepApi.add(
      `${room.name} builder${i}`,
      "builder",
      {
        sourceId: room.getAvailableSource()?.id as Id<EnergySourceStructure>,
        workRoom: room.name
      },
      room.name
    );
  }

  return OK;
}

/**
 * 发布刷墙工
 * @param room 要发布角色的房间
 * @param releaseNumber 要发布的角色数量
 */
function releaseRepairer(room: Room, releaseNumber = 1): OK | ERR_NOT_ENOUGH_ENERGY {
  let sources: Id<EnergySourceStructure>[];

  // 优先使用 container 中的能量
  if (!sources && room.sourceContainers.length > 0) sources = room.sourceContainers.map(c => c.id);
  // container 没有再去找 storage 或 terminal
  else if (!sources && room.storage) sources = [room.storage.id];
  else if (!sources && room.terminal && room.terminal.store[RESOURCE_ENERGY] > 0) sources = [room.terminal.id];
  // 都没有就没有能量来源了，拒绝发布
  else return ERR_NOT_ENOUGH_ENERGY;

  for (let i = 0; i < releaseNumber; i++) {
    creepApi.add(
      `${room.name} repair${i}`,
      "repairer",
      {
        sourceId: sources[i % sources.length],
        workRoom: room.name
      },
      room.name
    );
  }

  return OK;
}

/**
 * 发布矿工
 * @param room 要发布角色的房间
 */
function releaseMiner(room: Room): OK | ERR_NOT_FOUND {
  if (!room.terminal) return ERR_NOT_FOUND;

  creepApi.add(
    `${room.name} miner`,
    "miner",
    {
      sourceId: room.mineral.id,
      targetId: room.terminal.id
    },
    room.name
  );

  return OK;
}

/**
 * 房间运营角色名对应的发布逻辑
 */
export const roleToRelease: {
  [role in CreepRoleConstant]?: (room: Room, releaseNumber: number) => OK | ERR_NOT_FOUND | ERR_NOT_ENOUGH_ENERGY;
} = {
  harvester: releaseHarvester,
  collector: releaseHarvester,
  filler: releaseTransporter,
  manager: releaseTransporter,
  processor: releaseTransporter,
  upgrader: releaseUpgrader,
  builder: releaseBuilder,
  repairer: releaseRepairer,
  miner: releaseMiner
};
