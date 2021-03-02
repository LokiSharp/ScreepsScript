import { MAX_HARVESTER_NUM, MAX_UPGRADER_NUM, UPGRADE_WITH_STORAGE } from "@/setting";
import { creepApi } from "@/modules/creepController/creepApi";
import { getRoomEnergyTarget } from "@/modules/energyController";

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
        if (room.memory.canReClaim) return true;
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
        const upgraderIndexs = creepApi.has(`${room.name} RemoteUpgrader`) ? [0] : [0, 1, 2];

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
 * 发布搬运工
 * @param room 要发布角色的房间
 * @param releaseNumber 要发布的数量
 */
function releaseManager(room: Room, releaseNumber: number): OK {
  if (releaseNumber <= 0) releaseNumber = 1;
  for (let i = 0; i < releaseNumber; i++) {
    if (creepApi.has(`${room.name} manager${i}`)) continue;
    creepApi.add(`${room.name} manager${i}`, "manager", { workRoom: room.name }, room.name);
  }

  let extraIndex = releaseNumber;
  // 移除多余的搬运工
  while (creepApi.has(`${room.name} manager${extraIndex}`)) {
    creepApi.remove(`${room.name} manager${extraIndex}`);
    extraIndex += 1;
  }

  return OK;
}

/**
 * 发布搬运工
 * 发布中央运输单位
 * @param room 要发布角色的房间（memory 需要包含 center 字段）
 */
function releaseProcessor(room: Room): OK | ERR_NOT_FOUND {
  if (!room.memory.center) return ERR_NOT_FOUND;

  const [x, y] = room.memory.center;
  creepApi.add(`${room.name} processor`, "processor", { x, y }, room.name);

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
    const source = getRoomEnergyTarget(room);
    creepApi.add(
      `${room.name} builder${i}`,
      "builder",
      {
        sourceId: source?.id as Id<EnergySourceStructure>,
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
  manager: releaseManager,
  processor: releaseProcessor,
  upgrader: releaseUpgrader,
  builder: releaseBuilder,
  repairer: releaseRepairer,
  miner: releaseMiner
};
