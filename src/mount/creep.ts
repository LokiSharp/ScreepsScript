import { MIN_WALL_HITS, repairSetting } from "setting";
import { assignPrototype } from "utils/prototype";
import roles from "role";

export class CreepExtension extends Creep {
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param instanceName 发送日志的实例名
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  public log(content: string, color: Colors = undefined, notify = false): void {
    this.room.log(content, this.name, color, notify);
  }

  /**
   * creep 主要工作
   */
  public work(): void {
    // 检查 creep 内存中的角色是否存在
    if (!(this.memory.role in roles)) {
      this.log(`找不到对应的 creepConfig`, "yellow");
      this.say("我凉了！");
      return;
    }

    // 还没出生就啥都不干
    if (this.spawning) {
      // eslint-disable-next-line no-underscore-dangle
      if (this.ticksToLive === CREEP_LIFE_TIME) this._id = this.id; // 解决 this creep not exist 问题
      return;
    }

    // 快死时的处理
    if (this.ticksToLive <= 3) {
      // 如果还在工作，就释放掉自己的工作位置
      if (this.memory.standed) this.room.removeRestrictedPos(this.name);
    }

    // 获取对应配置项
    const creepConfig: ICreepConfig = roles[this.memory.role](this.memory.data);

    // 没准备的时候就执行准备阶段
    if (!this.memory.ready) {
      // 有准备阶段配置则执行
      if (creepConfig.prepare) this.memory.ready = creepConfig.prepare(this);
      // 没有就直接准备完成
      else this.memory.ready = true;
    }

    // 如果执行了 prepare 还没有 ready，就返回等下个 tick 再执行
    if (!this.memory.ready) return;

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
      if (this.memory.standed) {
        this.room.removeRestrictedPos(this.name);
        delete this.memory.standed;
      }
    }
  }

  /**
   * 无视 Creep 的寻路
   *
   * @param target 要移动到的位置
   */
  public goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    // const baseCost = Game.cpu.getUsed()
    const moveResult = this.moveTo(target, {
      reusePath: 10,
      ignoreCreeps: false,
      costCallback: (roomName, costMatrix) => {
        if (roomName === this.room.name) {
          // 避开房间中的禁止通行点
          const restrictedPos = this.room.getRestrictedPos();
          for (const creepName in restrictedPos) {
            // 自己注册的禁止通行点位自己可以走
            if (creepName === this.name) continue;

            const pos = this.room.unserializePos(restrictedPos[creepName]);
            costMatrix.set(pos.x, pos.y, 0xff);
          }
        }

        return costMatrix;
      }
    });

    return moveResult;
  }

  /**
   * 从目标结构获取能量
   *
   * @param target 提供能量的结构
   * @returns 执行 harvest 或 withdraw 后的返回值
   */
  public getEngryFrom(target: Structure | Source): ScreepsReturnCode {
    let result: ScreepsReturnCode;
    // 是建筑就用 withdraw
    if (target instanceof Structure) result = this.withdraw(target, RESOURCE_ENERGY);
    // 不是的话就用 harvest
    else {
      result = this.harvest(target);
    }

    if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos);

    return result;
  }

  /**
   * 转移资源到结构
   *
   * @param target 要转移到的目标
   * @param RESOURCE 要转移的资源类型
   */
  public transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode {
    // 转移能量实现
    this.goTo(target.pos);
    return this.transfer(target, RESOURCE);
  }

  /**
   * 填充本房间的 controller
   */
  public upgrade(): ScreepsReturnCode {
    const result = this.upgradeController(this.room.controller);

    // 如果刚开始站定工作，就把自己的位置设置为禁止通行点
    if (result === OK && !this.memory.standed) {
      this.memory.standed = true;
      this.room.addRestrictedPos(this.name, this.pos);
    } else if (result === ERR_NOT_IN_RANGE) {
      this.goTo(this.room.controller.pos);
    }
    return result;
  }

  /**
   * 建设房间内存在的建筑工地
   */
  public buildStructure(): CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH | ERR_NOT_FOUND {
    // 新建目标建筑工地
    let target: ConstructionSite;
    // 检查是否有缓存
    if (this.room.memory.constructionSiteId) {
      target = Game.getObjectById(this.room.memory.constructionSiteId as Id<ConstructionSite>);
      // 如果缓存中的工地不存在则说明建筑完成
      if (!target) {
        // 获取曾经工地的位置
        const constructionSitePos = new RoomPosition(
          this.room.memory.constructionSitePos[0],
          this.room.memory.constructionSitePos[1],
          this.room.name
        );
        // 检查上面是否有已经造好的同类型建筑
        const structure = _.find(
          constructionSitePos.lookFor(LOOK_STRUCTURES),
          s => s.structureType === this.room.memory.constructionSiteType
        );
        if (structure) {
          // 如果有的话就执行回调
          if (structure.onBuildComplete) structure.onBuildComplete();

          // 如果刚修好的是墙的话就记住该墙的 id，然后把血量刷高一点（相关逻辑见 builder.target()）
          if (structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART) {
            this.memory.fillWallId = structure.id;
          }
          // 如果修好的是 source container 的话，就执行注册
          else if (structure instanceof StructureContainer && this.room.sources.find(s => structure.pos.isNearTo(s))) {
            this.room.registerContainer(structure);
          }
        }

        // 获取下个建筑目标
        // eslint-disable-next-line no-underscore-dangle
        target = this._updateConstructionSite();
      }
    }
    // 没缓存就直接获取
    // eslint-disable-next-line no-underscore-dangle
    else target = this._updateConstructionSite();
    if (!target) return ERR_NOT_FOUND;

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
    const wall = Game.getObjectById<StructureWall | StructureRampart>(
      this.memory.fillWallId as Id<StructureWall | StructureRampart>
    );
    if (!wall) return ERR_NOT_FOUND;

    if (wall.hits < MIN_WALL_HITS) {
      const result = this.repair(wall);
      if (result === ERR_NOT_IN_RANGE) this.goTo(wall.pos);
    } else delete this.memory.fillWallId;

    return OK;
  }

  /**
   * 获取下一个建筑工地
   * 有的话将其 id 写入自己 memory.constructionSiteId
   *
   * @returns 下一个建筑工地，或者 null
   */
  private _updateConstructionSite(): ConstructionSite | undefined {
    const targets: ConstructionSite[] = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    if (targets.length > 0) {
      let target: ConstructionSite;
      // 优先建造 spawn，然后是 extension，想添加新的优先级就在下面的数组里追加即可
      for (const type of [STRUCTURE_SPAWN, STRUCTURE_EXTENSION]) {
        target = targets.find(cs => cs.structureType === type);
        if (target) break;
      }
      // 优先建造的都完成了，按照距离建造
      if (!target) target = this.pos.findClosestByRange(targets);

      // 缓存工地信息，用于统一建造并在之后验证是否完成建造
      this.room.memory.constructionSiteId = target.id;
      this.room.memory.constructionSiteType = target.structureType;
      this.room.memory.constructionSitePos = [target.pos.x, target.pos.y];
      return target;
    } else {
      delete this.room.memory.constructionSiteId;
      delete this.room.memory.constructionSiteType;
      delete this.room.memory.constructionSitePos;
      return undefined;
    }
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
    }

    // 获取墙壁
    if (!targetWall) targetWall = Game.getObjectById(focusWall.id as Id<StructureWall | StructureRampart>);
    // 如果缓存里的 id 找不到墙壁，就清除缓存下次再找
    if (!targetWall) {
      delete this.room.memory.focusWall;
      return false;
    }

    // 填充墙壁
    const result = this.repair(targetWall);
    if (result === OK) {
      if (!this.memory.standed) {
        this.memory.standed = true;
        this.room.addRestrictedPos(this.name, this.pos);
      }

      // 离墙三格远可能正好把路堵上，所以要走进一点
      if (!targetWall.pos.inRangeTo(this.pos, 2)) this.goTo(targetWall.pos);
    } else if (result === ERR_NOT_IN_RANGE) {
      this.goTo(targetWall.pos);
    }
    return true;
  }

  /**
   * 压缩 PathFinder 返回的路径数组
   *
   * @param positions 房间位置对象数组，必须连续
   * @returns 压缩好的路径
   */
  public serializeFarPath(positions: RoomPosition[]): string {
    if (positions.length === 0) return "";
    // 确保路径的第一个位置是自己的当前位置
    if (!positions[0].isEqualTo(this.pos)) positions.splice(0, 0, this.pos);

    return positions
      .map((pos, index) => {
        // 最后一个位置就不用再移动
        if (index >= positions.length - 1) return null;
        // 由于房间边缘地块会有重叠，所以这里筛除掉重叠的步骤
        if (pos.roomName !== positions[index + 1].roomName) return null;
        // 获取到下个位置的方向
        return pos.getDirectionTo(positions[index + 1]);
      })
      .join("");
  }

  /**
   * 远程寻路
   *
   * @param target 目标位置
   * @param range 搜索范围 默认为 1
   * @returns PathFinder.search 的返回值
   */
  public findPath(target: RoomPosition, range: number): string | null {
    if (!this.memory.farMove) this.memory.farMove = {};
    this.memory.farMove.index = 0;

    // 先查询下缓存里有没有值
    const routeKey = `${this.room.serializePos(this.pos)} ${this.room.serializePos(target)}`;
    let route = global.routeCache[routeKey];
    // 如果有值则直接返回
    if (route) {
      return route;
    }

    const result = PathFinder.search(
      this.pos,
      { pos: target, range },
      {
        plainCost: 2,
        swampCost: 10,
        maxOps: 4000,
        roomCallback: roomName => {
          // 强调了不许走就不走
          if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) return false;

          const room = Game.rooms[roomName];
          // 房间没有视野
          if (!room) return null;

          const costs = new PathFinder.CostMatrix();

          room.find(FIND_STRUCTURES).forEach(struct => {
            if (struct.structureType === STRUCTURE_ROAD) {
              costs.set(struct.pos.x, struct.pos.y, 1);
            }
            // 不能穿过无法行走的建筑
            else if (
              struct.structureType !== STRUCTURE_CONTAINER &&
              (struct.structureType !== STRUCTURE_RAMPART || !struct.my)
            )
              costs.set(struct.pos.x, struct.pos.y, 0xff);
          });

          // 避开房间中的禁止通行点
          const restrictedPos = room.getRestrictedPos();
          for (const creepName in restrictedPos) {
            // 自己注册的禁止通行点位自己可以走
            if (creepName === this.name) continue;
            const pos = room.unserializePos(restrictedPos[creepName]);
            costs.set(pos.x, pos.y, 0xff);
          }

          return costs;
        }
      }
    );

    // 寻路失败就通知玩家
    if (result.incomplete) {
      const states = [
        `[${this.name} 未完成寻路] [游戏时间] ${Game.time} [所在房间] ${this.room.name}`,
        `[creep 内存]`,
        JSON.stringify(this.memory, null, 4),
        `[寻路结果]`,
        JSON.stringify(result)
      ];
      Game.notify(states.join("\n"));
    }

    // 没找到就返回 null
    if (result.path.length <= 0) return null;
    // 找到了就进行压缩
    route = this.serializeFarPath(result.path);
    // 保存到全局缓存
    if (!result.incomplete) global.routeCache[routeKey] = route;

    return route;
  }

  /**
   * 使用缓存进行移动
   * 该方法会对 creep.memory.farMove 产生影响
   *
   * @returns ERR_NO_PATH 找不到缓存
   * @returns ERR_INVALID_TARGET 撞墙上了
   */
  public goByCache(): CreepMoveReturnCode | ERR_NO_PATH | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET | ERR_INVALID_ARGS {
    if (!this.memory.farMove) return ERR_NO_PATH;

    const index = this.memory.farMove.index;
    // 移动索引超过数组上限代表到达目的地
    if (index >= this.memory.farMove.path.length) {
      delete this.memory.farMove.path;
      return OK;
    }

    // 获取方向，进行移动
    const direction = Number(this.memory.farMove.path[index]) as DirectionConstant;
    const goResult = this.move(direction);

    // 移动成功，更新下次移动索引
    if (goResult === OK) this.memory.farMove.index++;

    return goResult;
  }

  /**
   * 远程寻路
   * 包含对穿功能，会自动躲避 bypass 中配置的绕过房间
   *
   * @param target 要移动到的位置对象
   * @param range 允许移动到目标周围的范围
   */
  public farMoveTo(
    target: RoomPosition,
    range = 0
  ): CreepMoveReturnCode | ERR_NO_PATH | ERR_NOT_IN_RANGE | ERR_INVALID_TARGET | ERR_INVALID_ARGS {
    if (this.memory.farMove === undefined) this.memory.farMove = {};
    // 确认目标有没有变化, 变化了则重新规划路线
    const targetPosTag = this.room.serializePos(target);
    if (targetPosTag !== this.memory.farMove.targetPos) {
      this.memory.farMove.targetPos = targetPosTag;
      this.memory.farMove.path = this.findPath(target, range);
    }
    // 确认缓存有没有被清除
    if (!this.memory.farMove.path) {
      this.memory.farMove.path = this.findPath(target, range);
    }

    // 还为空的话就是没找到路径
    if (!this.memory.farMove.path) {
      delete this.memory.farMove.path;
      return OK;
    }

    // 使用缓存进行移动
    const goResult = this.goByCache();

    // 如果发生撞停或者参数异常的话说明缓存可能存在问题，移除缓存
    if (goResult === ERR_INVALID_TARGET || goResult === ERR_INVALID_ARGS) {
      delete this.memory.farMove.path;
    }
    // 其他异常直接报告
    else if (goResult !== OK && goResult !== ERR_TIRED) this.say(`远程寻路 ${goResult}`);

    return goResult;
  }
}

// 挂载拓展到 Creep 原型
export default function (): void {
  assignPrototype(Creep, CreepExtension);
}
