import { MIN_WALL_HITS, repairSetting } from "@/setting";
import { Move, WayPoint } from "@/modules/move";
import creepWorks from "@/role";
import { getMemoryFromCrossShard } from "@/modules/crossShard";
import { getNearSite } from "@/modules/ConstructionController";
import { useCache } from "@/utils/global/useCache";

export class CreepExtension extends Creep {
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  public log(content: string, color: Colors = undefined, notify = false): void {
    this.room.log(content, this.name, color, notify);
  }

  /**
   * creep 主要工作
   */
  public onWork(): void {
    // 检查 creep 内存中的角色是否存在
    if (!(this.memory.role in creepWorks)) {
      // 没有的话可能是放在跨 shard 暂存区了
      const memory = getMemoryFromCrossShard(this.name);
      // console.log(`${this.name} 从暂存区获取了内存`, memory)
      if (!memory) {
        this.log(`找不到对应内存`, "yellow");
        this.say("我凉了！");
        return;
      }
    }

    // 还没出生就啥都不干
    if (this.spawning) return;

    // 获取对应配置项
    const creepConfig: CreepConfig<CreepRoleConstant> = creepWorks[this.memory.role];

    // 没准备的时候就执行准备阶段
    if (!this.memory.ready) {
      // 有准备阶段配置则执行
      if (creepConfig.prepare) this.memory.ready = creepConfig.prepare(this);
      // 没有就直接准备完成
      else this.memory.ready = true;
    }

    // 如果执行了 prepare 还没有 ready，就返回等下个 tick 再执行
    if (!this.memory.ready) return;

    // 没路径的时候就执行路径阶段
    if (!this.memory.setWayPoint) {
      // 有路径阶段配置则执行
      if (creepConfig.wayPoint) this.memory.setWayPoint = creepConfig.wayPoint(this);
      // 没有就直接完成
      else this.memory.setWayPoint = true;
    }

    // 如果执行了 wayPoint 还没有 ready，就返回等下个 tick 再执行
    if (!this.memory.setWayPoint) return;

    // 没路径的时候就执行路径阶段
    if (!this.memory.inPlace) {
      // 有路径阶段配置则执行
      if (creepConfig.inPlace) this.memory.inPlace = creepConfig.inPlace(this);
      // 没有就直接完成
      else this.memory.inPlace = true;
    }

    // 如果执行了 wayPoint 还没有 ready，就返回等下个 tick 再执行
    if (!this.memory.inPlace) return;

    // 获取是否工作，没有 source 的话直接执行 target
    const working = creepConfig.source ? this.memory.working : true;

    let stateChange = false;
    // 执行对应阶段
    // 阶段执行结果返回 true 就说明需要更换 working 状态
    if (working) {
      if (creepConfig.target && creepConfig.target(this)) stateChange = true;
    } else {
      if (creepConfig.source && creepConfig.source(this)) stateChange = true;
    }

    // 状态变化了就释放工作位置
    if (stateChange) {
      this.memory.working = !this.memory.working;
      if (this.memory.stand) {
        delete this.memory.stand;
      }
    }
  }

  /**
   * 无视 Creep 的寻路
   *
   * @param target 要移动到的位置
   * @param moveOpt 移动参数
   */
  public goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode {
    return Move.goTo(this, target, moveOpt);
  }

  /**
   * 设置路径点
   *
   * @see doc/移动及寻路设计案
   * @param target 要进行设置的目标，位置字符串数组或者是路径名前缀
   */
  public setWayPoint(target: string[] | string): ScreepsReturnCode {
    this.memory.fromShard = Game.shard.name as ShardName;
    return WayPoint.setWayPoint(this, target);
  }

  /**
   * 从目标结构获取能量
   *
   * @param target 提供能量的结构
   * @returns 执行 harvest 或 withdraw 后的返回值
   */
  public getEngryFrom(target: Structure | Source | Ruin | Resource<RESOURCE_ENERGY>): ScreepsReturnCode {
    let result: ScreepsReturnCode;
    // 是资源就用 pickup
    if (target instanceof Resource) result = this.pickup(target);
    // 是建筑就用 withdraw
    else if (target instanceof Structure || target instanceof Ruin) result = this.withdraw(target, RESOURCE_ENERGY);
    // 不是的话就用 harvest
    else {
      result = this.harvest(target);
    }

    if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos);
    return result;
  }

  /**
   * 切换为能量获取状态
   * 应在 target 阶段能量不足时调用
   *
   * @returns boolean
   */
  public backToGetEnergy(): boolean {
    // 移除能量来源缓存，便于重新查找最近的
    delete this.memory.sourceId;
    return true;
  }

  /**
   * 转移资源到建筑
   * 包含移动逻辑
   *
   * @param target 要转移到的目标
   * @param RESOURCE 要转移的资源类型
   * @param moveOpt 移动参数
   */
  public transferTo(
    target: AnyCreep | Structure,
    RESOURCE: ResourceConstant,
    moveOpt: MoveOpt = {}
  ): ScreepsReturnCode {
    this.goTo(target.pos, moveOpt);
    return this.transfer(target, RESOURCE);
  }

  /**
   * 填充本房间的 controller
   */
  public upgradeRoom(roomName: string): ScreepsReturnCode {
    const workRoom = Game.rooms[roomName];
    if (!workRoom) {
      this.goTo(new RoomPosition(25, 25, roomName), { checkTarget: false });
      return ERR_NOT_IN_RANGE;
    }
    const result = this.upgradeController(workRoom.controller);

    if (result === ERR_NOT_IN_RANGE) this.goTo(workRoom.controller.pos);
    return result;
  }

  /**
   * 建筑目标获取
   * 优先级：指定的目标 > 自己保存的目标 > 房间内保存的目标
   */
  private getBuildTarget(target?: ConstructionSite): ConstructionSite {
    // 指定了目标，直接用，并且把 id 备份一下
    if (target) {
      this.memory.constructionSiteId = target.id;
      this.memory.constructionSitePos = [target.pos.x, target.pos.y];
      this.memory.constructionSiteType = target.structureType;
      return target;
    }
    // 没有指定目标，或者指定的目标消失了，从本地内存查找
    else {
      const selfKeepTarget = Game.getObjectById(this.memory.constructionSiteId);
      if (selfKeepTarget) return selfKeepTarget;
      // 本地内存里保存的 id 找不到工地了，检查下是不是造好了
      else if (this.memory.constructionSitePos) {
        // 获取曾经工地的位置
        const constructionSitePos = new RoomPosition(
          this.memory.constructionSitePos[0],
          this.memory.constructionSitePos[1],
          this.room.name
        );
        // 检查上面是否有已经造好的同类型建筑
        const structure = _.find(
          constructionSitePos.lookFor(LOOK_STRUCTURES),
          s => s.structureType === this.memory.constructionSiteType
        );
        // 如果刚修好的是墙的话就记住该墙的 id，然后把血量刷高一点）
        if (
          structure &&
          (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART)
        ) {
          this.memory.fillWallId = structure.id as Id<StructureWall | StructureRampart>;
          // 同时发布刷墙任务
          this.room.work.updateTask({ type: "fillWall", priority: 0 });
        }

        delete this.memory.constructionSiteId;
      }
    }

    // 自己内存里没找到，去房间内存里查找，房间内存没有的话就搜索并缓存到房间
    const roomKeepTarget =
      Game.getObjectById(this.room.memory.constructionSiteId) ||
      useCache(() => getNearSite(this.pos), this.room.memory, "constructionSiteId");

    // 找到了，保存到自己内存里
    if (roomKeepTarget) {
      this.memory.constructionSiteId = this.room.memory.constructionSiteId;
      return roomKeepTarget;
    } else delete this.room.memory.constructionSiteId;

    const selfFindTarget = this.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);

    // 找到了，保存到自己内存里
    if (selfFindTarget) {
      this.memory.constructionSiteId = selfFindTarget.id;
      return selfFindTarget;
    }

    return undefined;
  }

  /**
   * 建设房间内存在的建筑工地
   * @param targetConstruction 手动指定建造的工地
   */
  public buildStructure(
    targetConstruction?: ConstructionSite
  ): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    // 新建目标建筑工地
    const target = this.getBuildTarget(targetConstruction);

    if (!target) return ERR_NOT_FOUND;
    // 上面发现有墙要刷了，这个 tick 就不再造建造了
    // 防止出现造好一个 rampart，然后直接造下一个 rampart，造好后又扭头去刷第一个 rampart 的小问题出现
    if (this.memory.fillWallId) return ERR_BUSY;

    // 建设
    const buildResult = this.build(target);
    if (buildResult === OK) {
      // 如果修好的是 rempart 的话就移除墙壁缓存
      // 让维修单位可以快速发现新 rempart
      if (target.structureType === STRUCTURE_RAMPART) delete this.room.memory.focusWall;
    } else if (buildResult === ERR_NOT_IN_RANGE) this.goTo(target.pos);
    return buildResult;
  }

  /**
   * 稳定新墙
   * 会把内存中 fillWallId 标注的墙声明值刷到定值以上
   */
  public steadyWall(): OK | ERR_NOT_FOUND {
    const wall = Game.getObjectById(this.memory.fillWallId);
    if (!wall) return ERR_NOT_FOUND;

    if (wall.hits < MIN_WALL_HITS) {
      const result = this.repair(wall);
      if (result === ERR_NOT_IN_RANGE) this.goTo(wall.pos);
    } else delete this.memory.fillWallId;

    return OK;
  }

  /**
   * 填充防御性建筑
   * 包括 wall 和 rempart
   */
  public fillDefenseStructure(): boolean {
    const focusWall = this.room.memory.focusWall;
    let targetWall: StructureWall | StructureRampart = null;
    // 该属性不存在 或者 当前时间已经大于关注时间 就刷新
    if (!focusWall || (focusWall && Game.time >= focusWall.endTime)) {
      // 获取所有没填满的墙
      const walls = this.room.find(FIND_STRUCTURES, {
        filter: s => s.hits < s.hitsMax && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
      }) as (StructureWall | StructureRampart)[];
      // 没有目标就啥都不干
      if (walls.length <= 0) return false;

      // 找到血量最小的墙
      targetWall = walls.sort((a, b) => a.hits - b.hits)[0];

      // 将其缓存在内存里
      this.room.memory.focusWall = {
        id: targetWall.id,
        endTime: Game.time + repairSetting.focusTime
      };

      // 将其缓存在内存里
      this.room.memory.focusWall = {
        id: targetWall.id,
        endTime: Game.time + repairSetting.focusTime
      };
    }

    // 获取墙壁
    if (!targetWall) targetWall = Game.getObjectById(focusWall.id);
    // 如果缓存里的 id 找不到墙壁，就清除缓存下次再找
    if (!targetWall) {
      delete this.room.memory.focusWall;
      return false;
    }

    // 填充墙壁
    const result = this.repair(targetWall);
    if (result === ERR_NOT_IN_RANGE) this.goTo(targetWall.pos);
    return true;
  }

  /**
   * 检查旗帜是否存在
   * 不存在的话会在控制台给出提示
   *
   * @param flagName 要检查的 flag 名称
   * @returns 有旗帜就返回旗帜, 否则返回 null
   */
  public getFlag(flagName: string): Flag | null {
    const flag = Game.flags[flagName];
    if (!flag) {
      this.log(`场上不存在名称为 [${flagName}] 的旗帜，请新建`);
      return null;
    } else return flag;
  }

  /**
   * 进攻
   * 向指定旗帜旗帜发起进攻
   *
   * @param flagName 要进攻的旗帜名称
   */
  public attackFlag(flagName: string): boolean {
    this.say("💢", true);
    // 获取旗帜
    const attackFlag = this.getFlag(flagName);
    if (!attackFlag) return false;

    // 如果 creep 不在房间里 则一直向旗帜移动
    if (!attackFlag.room || (attackFlag.room && this.room.name !== attackFlag.room.name)) {
      this.goTo(attackFlag.pos);
      return true;
    }

    // 如果到旗帜所在房间了
    // 优先攻击 creep
    let target: AnyCreep | Structure;

    const hostils = this.getHostileCreepsWithCache();
    if (hostils.length > 0) {
      // 找到最近的 creep
      target = hostils.find(hostil => Math.abs(hostil.pos.x - this.pos.x) + Math.abs(hostil.pos.y - this.pos.y) === 1);
    }
    if (!target) {
      // 没有的话再攻击 structure
      const structures = attackFlag.pos.lookFor(LOOK_STRUCTURES);
      if (structures.length > 0) {
        target = structures[0];
      } else {
        const targets = this.getHostileStructuresWithCache().filter(
          structure =>
            structure.structureType === STRUCTURE_TOWER ||
            structure.structureType === STRUCTURE_NUKER ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_EXTENSION
        );

        // 找到血量最低的建筑
        target = this.getMinHitsTarget(targets);
      }
    }

    if (target && this.attack(target) === ERR_NOT_IN_RANGE) this.moveTo(target);

    return true;
  }

  /**
   * 治疗指定目标
   * 比较给定目标生命(包括自己)生命损失的百分比, 谁血最低治疗谁
   * @param creep 要治疗的目标
   */
  public healTo(creep: Creep): void {
    if (!creep) {
      this.heal(this);
      return;
    }

    // 获取治疗目标，目标生命值损失大于等于自己的话，就治疗目标
    // 否则治疗自己
    let target: Creep;
    if (creep.hitsMax - creep.hits >= this.hitsMax - this.hits) target = creep;
    else target = this;

    // 进行治疗，如果失败就远程治疗
    const healResult = this.heal(target);
    if (healResult === ERR_NOT_IN_RANGE) this.rangedHeal(target);

    // 一直朝着目标移动，在友方领土上移动时会无视 creep
    if (
      !this.room.controller ||
      !this.room.controller.owner ||
      this.room.controller.owner.username !== this.owner.username
    )
      this.moveTo(creep);
    else this.goTo(creep.pos);

    // 检查自己是不是在骑墙
    if (this.onEnter()) {
      const safePosFinder = i => i !== 0 && i !== 49;
      // 遍历找到目标 creep 身边的不骑墙位置
      const x = [creep.pos.x - 1, creep.pos.x + 1].find(safePosFinder);
      const y = [creep.pos.y - 1, creep.pos.y + 1].find(safePosFinder);

      // 移动到不骑墙位置
      this.moveTo(new RoomPosition(x, y, creep.pos.roomName));
    }
  }

  /**
   * 判断当前是否在入口处（是否骑墙）
   */
  private onEnter(): boolean {
    return this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49;
  }

  /**
   * 是否可以和指定 Creep 一起移动
   * 并不会执行移动，本方法只是进行查询，返回 true 时说明当前两者状态可以一起移动
   * 当目标 creep 不存在时本方法将永远返回 false
   *
   * @param creep 要一起移动的 creep
   * @returns 可以移动时返回 true，否则返回 false
   */
  private canMoveWith(creep: Creep): boolean {
    return creep && this.pos.isNearTo(creep) && creep.fatigue === 0;
  }

  /**
   * 拆除旗帜下的建筑
   * 向指定旗帜发起进攻并拆除旗帜下的建筑
   *
   * @param flagName 要进攻的旗帜名称
   * @param healerName 治疗单位名称
   */
  public dismantleFlag(flagName: string, healerName = ""): boolean {
    // 获取旗帜
    const attackFlag = this.getFlag(flagName);
    if (!attackFlag) return false;
    // 治疗单位
    const healer = Game.creeps[healerName];

    // 如果 creep 不在房间里 则一直向旗帜移动
    if (!attackFlag.room || (attackFlag.room && this.room.name !== attackFlag.room.name)) {
      // 如果 healer 存在则只会在 healer 相邻且可以移动时才进行移动
      if (!healer || (healer && this.canMoveWith(healer))) this.goTo(attackFlag.pos);
      return true;
    }

    let target: Structure;
    // 如果到旗帜所在房间了
    const structures = attackFlag.pos.lookFor(LOOK_STRUCTURES);

    // healer 不存在（自己行动）或者 healer 可以和自己同时移动时才允许自己移动
    if (!healer || (healer && this.canMoveWith(healer))) {
      if (structures.length > 0) {
        target = structures[0];
      } else {
        const targets = this.getHostileStructuresWithCache().filter(
          structure =>
            structure.structureType === STRUCTURE_TOWER ||
            structure.structureType === STRUCTURE_NUKER ||
            structure.structureType === STRUCTURE_SPAWN ||
            structure.structureType === STRUCTURE_EXTENSION
        );

        // 找到血量最低的建筑
        target = this.getMinHitsTarget(targets) as Structure;
      }

      if (target && this.dismantle(target) === ERR_NOT_IN_RANGE) this.moveTo(target);

      // 如果之前在拆墙则移除刚才所在的禁止通行点位
      if (this.memory.stand) {
        delete this.memory.stand;
      }
    }

    return false;
  }

  /**
   * 找到血量最低的目标
   *
   * @param targets 目标
   */
  private getMinHitsTarget(
    targets: (AnyCreep | Structure<StructureConstant>)[]
  ): AnyCreep | Structure<StructureConstant> {
    return _.min(targets, target => {
      // 该 creep 是否在 rampart 中
      const inRampart = target.pos
        .lookFor(LOOK_STRUCTURES)
        .find(rampart => rampart.structureType === STRUCTURE_RAMPART);

      // 在 rampart 里就不会作为进攻目标
      if (inRampart) return target.hits + inRampart.hits;
      // 找到血量最低的
      else return target.hits;
    });
  }
  /**
   *
   * RA 攻击单位并保持距离
   *
   * @param target 目标
   * @param range 距离
   */
  public rangedAttackTargetWithRange(target: AnyCreep, range = 1): OK | ERR_NOT_FOUND {
    if (target) {
      this.rangedAttack(target);
      this.moveTo(target, { range });
      return OK;
    } else return ERR_NOT_FOUND;
  }

  /**
   * RA 攻击血量最低的敌方单位
   *
   * @param hostils 敌方目标
   */
  public rangedAttackLowestHitsHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND {
    if (!hostils) hostils = this.getHostileCreepsWithCache();
    if (hostils.length > 0) {
      // 找到血量最低的 creep
      const target = hostils.find(creep => creep);

      return this.rangedAttackTargetWithRange(target);
    }

    return ERR_NOT_FOUND;
  }

  /**
   * RA 攻击有治疗能力的敌方单位
   *
   * @param hostils 敌方目标
   */
  public rangedAttackHostileHealCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND {
    if (!hostils) hostils = this.getHostileCreepsWithCache();
    const targets = this.pos.findInRange(hostils, 6) as Creep[];
    if (targets.length > 0) {
      // 找到有治疗能力的 creep
      const target = targets.find(creep => {
        if (creep.body) return creep.body.find(part => part.type === HEAL);
        else return false;
      });

      return this.rangedAttackTargetWithRange(target);
    }

    return ERR_NOT_FOUND;
  }

  /**
   * RA 攻击最近的敌方单位
   *
   * @param hostils 敌方目标
   */
  public rangedAttackNearestHostileCreeps(hostils?: AnyCreep[]): OK | ERR_NOT_FOUND {
    if (!hostils) hostils = this.getHostileCreepsWithCache();
    const target = this.pos.findClosestByPath(hostils);

    return this.rangedAttackTargetWithRange(target);
  }

  /**
   * RA 攻击血量最低的敌方建筑
   */
  public rangedAttackLowestHitsHostileStructures(): OK | ERR_NOT_FOUND {
    const targets = this.getHostileStructuresWithCache().filter(
      structure =>
        structure.structureType === STRUCTURE_TOWER ||
        structure.structureType === STRUCTURE_NUKER ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION
    );

    if (targets.length <= 0) return ERR_NOT_FOUND;

    // 找到血量最低的建筑
    const target = this.getMinHitsTarget(targets);

    if (target && this.rangedAttack(target) === ERR_NOT_IN_RANGE) this.moveTo(target);

    return OK;
  }

  /**
   * RA 攻击最近的敌方建筑
   */
  public rangedAttackNearHostileStructures(): OK | ERR_NOT_FOUND {
    const targets = this.getHostileStructuresWithCache().filter(
      structure =>
        structure.structureType === STRUCTURE_TOWER ||
        structure.structureType === STRUCTURE_NUKER ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION
    );

    if (targets.length <= 0) return ERR_NOT_FOUND;

    // 找到最近的敌方建筑
    const target = this.pos.findClosestByRange(targets);

    if (target && this.rangedAttack(target) === ERR_NOT_IN_RANGE) this.moveTo(target);

    return OK;
  }

  /**
   * 从缓存获取敌方建筑物
   */
  public getHostileStructuresWithCache(hard?: boolean): Structure<StructureConstant>[] {
    const expireTime = 100;
    if (!this.room.memory.targetHostileStructuresCache) {
      this.room.memory.targetHostileStructuresCache = [];
    }

    let targets = this.room.memory.targetHostileStructuresCache.map(id => Game.getObjectById(id));
    targets = targets.filter(target => target);

    if (targets.length <= 0 || hard || Game.time >= this.room.memory.targetHostileStructuresCacheExpireTime) {
      targets = this.room.find(FIND_HOSTILE_STRUCTURES);
      this.room.memory.targetHostileStructuresCache = targets.map(target => target.id);
      this.room.memory.targetHostileStructuresCacheExpireTime = Game.time + expireTime;
    }

    return targets;
  }

  /**
   * 从缓存获取敌方 Creep
   */
  public getHostileCreepsWithCache(hard?: boolean): AnyCreep[] {
    const expireTime = 5;
    if (!this.room.memory.targetHostileCreepsCache) {
      this.room.memory.targetHostileCreepsCache = [];
    }

    let targets = this.room.memory.targetHostileCreepsCache.map(id => Game.getObjectById(id));
    targets = targets.filter(target => target);

    if (targets.length <= 0 || hard || Game.time >= this.room.memory.targetHostileCreepsCacheExpireTime) {
      targets = this.room.find(FIND_HOSTILE_CREEPS);
      this.room.memory.targetHostileCreepsCache = targets.map(target => target.id);
      this.room.memory.targetHostileCreepsCacheExpireTime = Game.time + expireTime;
    }

    return targets;
  }

  /**
   * 待命
   * 移动到 [房间名 StandBy] 旗帜的位置
   */
  public standBy(): void {
    // 如果已经在待命位置则原地不动
    if (this.memory.isStanBy) return;
    // 获取旗帜
    const standByFlag = this.getFlag(`${this.name} StandBy`);
    if (!standByFlag) {
      this.say("去哪待命?");
      return;
    }
    // 如果没到 就向旗帜移动
    if (!this.pos.isEqualTo(standByFlag.pos)) this.goTo(standByFlag.pos, { range: 0 });
    else this.memory.isStanBy = true;
  }
}
