import { LEVEL_BUILD_RAMPART } from "../../../setting";
import { creepApi } from "modules/creepController/creepApi";
import { setRoomStats } from "modules/stateCollector";
import { whiteListFilter } from "utils/global/whiteListFilter";

/**
 * Controller 拓展
 * 统计当前升级进度、移除无效的禁止通行点位
 */
export default class ControllerExtension extends StructureController {
  public work(): void {
    if (Game.time % 20) return;
    // 如果等级发生变化了就运行 creep 规划
    if (this.stateScanner()) this.onLevelChange(this.level);

    // 8 级并且快掉级了就孵化 upgrader
    if (this.level === 8 && this.ticksToDowngrade <= 100000)
      creepApi.add(
        `${this.room.name} upgrader1`,
        "upgrader",
        {
          sourceId: this.room.storage.id
        },
        this.room.name
      );
  }

  /**
   * 当等级发生变化时的回调函数
   *
   * @param level 当前的等级
   */
  public onLevelChange(level: number): void {
    this.room.releaseCreep("harvester");

    // 刚占领，添加最基础的角色组
    if (level === 1) {
      // 多发布一个 build 协助建造
      this.room.releaseCreep("builder", 1);
    }
    // 到达建墙等级，添加刷墙者
    if (level === LEVEL_BUILD_RAMPART[0]) {
      // 发布 repairer 刷墙
      this.room.releaseCreep("repairer", 2);
    }
    // 8 级之后重新规划升级单位
    else if (level === 8) {
      this.room.releaseCreep("upgrader");
      this.room.releaseCreep("repairer");
    }

    // 规划布局
    this.log(this.room.planLayout(), "green");
  }

  /**
   * 统计自己的等级信息
   *
   * @returns 为 true 时说明自己等级发生了变化
   */
  private stateScanner(): boolean {
    let hasLevelChange = false;
    setRoomStats(this.room.name, stats => {
      hasLevelChange = stats.controllerLevel !== this.level;
      return {
        // 统计升级进度
        controllerRatio: (this.progress / this.progressTotal) * 100,
        // 统计房间等级
        controllerLevel: this.level
      };
    });

    this.constructionSiteScanner();
    this.structureScanner();

    return hasLevelChange;
  }

  /**
   * 检查敌人威胁
   * 检查房间内所有敌人的身体部件情况确认是否可以造成威胁
   *
   * @returns 是否可以造成威胁（是否启用主动防御模式）
   */
  public checkEnemyThreat(): boolean {
    // 这里并没有搜索 PC，因为 PC 不是敌人主力
    const enemy =
      this.room.enemys ||
      this.room.find(FIND_HOSTILE_CREEPS, {
        filter: whiteListFilter
      });
    if (enemy && enemy.length <= 0) return false;

    // 如果来的都是入侵者的话，就算撑破天了也不管
    if (!enemy.find(creep => creep.owner.username !== "Invader")) return false;

    const bodyNum = enemy
      .map(creep => {
        // 如果是 creep 则返回身体部件，如果不是则不参与验证
        return creep instanceof Creep ? creep.body.length : 0;
      })
      .reduce((pre, cur) => pre + cur);
    // 满配 creep 数量大于 1，就启动主动防御
    return bodyNum > MAX_CREEP_SIZE;
  }

  /**
   * 扫描房间内工地
   *
   * @returns 为 true 时说明自己房间内有工地
   */
  private constructionSiteScanner(): boolean {
    let hasConstructionSites = false;
    const constructionSites = this.room.find(FIND_CONSTRUCTION_SITES);

    const constructionSiteIds: Id<ConstructionSite<BuildableStructureConstant>>[] = [];
    const constructionSiteNums: { [structureName: string]: number } = {};

    if (constructionSites.length > 0) {
      hasConstructionSites = true;
      Object.values(constructionSites).forEach(constructionSite => {
        constructionSiteIds.push(constructionSite.id);

        if (
          constructionSiteNums &&
          !Object.keys(constructionSiteNums).includes(constructionSite.structureType.toString())
        ) {
          constructionSiteNums[constructionSite.structureType.toString()] = 1;
        } else {
          constructionSiteNums[constructionSite.structureType.toString()] += 1;
        }
      });
    }

    Memory.rooms[this.room.name].constructionSiteIds = constructionSiteIds;
    Memory.stats.rooms[this.room.name].constructionSiteNums = constructionSiteNums;
    return hasConstructionSites;
  }

  /**
   * 扫描房间内建筑
   */
  private structureScanner(): void {
    const structures = this.room.find(FIND_STRUCTURES);
    const structureNums: { [structureName: string]: number } = {};

    if (structures.length > 0) {
      Object.values(structures).forEach(structure => {
        if (!Object.keys(structureNums).includes(structure.structureType)) {
          structureNums[structure.structureType] = 1;
        } else {
          structureNums[structure.structureType] += 1;
        }
      });
    }
    Memory.stats.rooms[this.room.name].structureNums = structureNums;
  }
}
