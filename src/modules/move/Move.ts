import { Cross } from "./Cross";
import { WayPoint } from "./WayPoint";
import { addCrossShardRequest } from "@/modules/crossShard";
import crossRules from "./crossRules";

export class Move {
  /**
   * 房间移动成本缓存
   *
   * 会缓存房间内的静态地形、道路、建筑等短时间内不会移动的对象
   * 如果出现了撞墙等情况，说明缓存过期，会在撞墙时移除缓存以便下次重新搜索
   */
  public static costCache: { [roomName: string]: CostMatrix } = {};

  /**
   * 路径缓存
   *
   * Creep 在执行远程寻路时会优先检查该缓存
   * 键为路径的起点和终点名，例如："12/32/W1N1 23/12/W2N2"，值是使用 serializeFarPath 序列化后的路径
   */
  public static routeCache: { [routeKey: string]: string } = {};

  /**
   * 移动 creep
   *
   * @param creep 要进行移动的 creep
   * @param targetPos 要移动到的目标位置
   * @param moveOpt 移动参数
   */
  public static goToInner(
    creep: Creep | PowerCreep,
    targetPos: RoomPosition | undefined,
    moveOpt: MoveOpt
  ): ScreepsReturnCode {
    // 默认会检查目标变更
    const options = _.defaults<MoveOpt>({ checkTarget: true }, moveOpt);

    if (!creep.memory.moveInfo) creep.memory.moveInfo = {};

    const moveMemory = creep.memory.moveInfo;
    if (creep.memory.logPrePos) creep.log(`位置 ${moveMemory.prePos}`);

    // 如果没有指定目标的话则默认为路径模式
    const target: RoomPosition = targetPos || this.getTarget(creep);
    if (!target) return ERR_INVALID_ARGS;

    const currentPos = `${creep.pos.x}/${creep.pos.y}`;

    // 确认目标有没有变化, 变化了则重新规划路线
    if (options.checkTarget) {
      const targetPosTag = creep.room.serializePos(target);

      if (targetPosTag !== moveMemory.targetPos) {
        moveMemory.targetPos = targetPosTag;
        delete moveMemory.path;
        delete moveMemory.prePos;
      }
    }

    // 有 lastMove 说明已经在移动了，检查上一 tick 移动是否成功
    // （因为上一步的移动结果在这一 tick 开始时才会更新，所以要先检查之前移动是否成功，然后再决定是否要继续移动）
    if (moveMemory.lastMove) {
      // 如果和之前位置重复了就分析撞上了啥
      if (moveMemory.prePos && currentPos === moveMemory.prePos) {
        if (!moveMemory.lastMove) {
          delete moveMemory.path;
          delete moveMemory.prePos;
          return ERR_INVALID_TARGET;
        }

        // 获取前方位置上的 creep（fontCreep）
        const fontPos = creep.pos.directionToPos(moveMemory.lastMove);

        if (!fontPos) {
          delete moveMemory.path;
          delete moveMemory.prePos;
          return ERR_INVALID_TARGET;
        }

        const fontCreep = fontPos.lookFor(LOOK_CREEPS)[0] || fontPos.lookFor(LOOK_POWER_CREEPS)[0];

        // 前方不是 creep 或者不是自己的 creep 或者内存被清空（正在跨越 shard）的话就不会发起对穿
        if (!fontCreep || !fontCreep.my || Object.keys(fontCreep.memory).length <= 0) {
          delete moveMemory.path;
          delete moveMemory.prePos;
          delete this.costCache[creep.room.name];
          this.routeCache = {};
          return ERR_INVALID_TARGET;
        }
        // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
        const crossResult = options.disableCross ? ERR_BUSY : Cross.mutualCross(creep, moveMemory.lastMove, fontCreep);

        // 对穿失败说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
        if (crossResult === ERR_BUSY) {
          moveMemory.path = this.findPath(creep, targetPos, { ...options, disableRouteCache: true });
          delete moveMemory.prePos;
          // 撞地形上了说明房间 cost 过期了
          delete this.costCache[creep.room.name];
        } else if (crossResult !== OK) {
          // creep.log('撞停！重新寻路！' + crossResult)
          delete moveMemory.path;
          delete moveMemory.prePos;
          // 不知道撞到了啥，反正重新加载房间缓存
          delete this.costCache[creep.room.name];
        }

        // 对穿失败，需要重新寻路，不需要往下继续执行
        // 对穿成功，相当于重新执行了上一步，也不需要继续往下执行
        return crossResult;
      }

      // 验证通过，没有撞停，继续下一步
      delete moveMemory.lastMove;
    }

    // 如果没有路径的话就重新发起搜索
    if (!moveMemory.path) moveMemory.path = this.findPath(creep, target, options);

    // 还为空的话就是没找到路径或者已经到了
    if (!creep.memory.moveInfo.path) {
      // 到达目的地后如果是路径模式的话就需要更新路径点
      if (!targetPos) WayPoint.updateWayPoint(creep);
      return OK;
    }

    // 使用缓存进行移动
    const direction = Number(creep.memory.moveInfo.path[0]) as DirectionConstant;
    const goResult = creep.move(direction);

    /**
     * 如果是跨 shard 单位的话就要检查下目标是不是传送门
     *
     * 这里没办法直接通过判断当前位置在不在传送门上来确定是不是要跨 shard
     * 因为在 screeps 声明周期的创建阶段中：位置变更到传送门上后会立刻把 creep 转移到新 shard
     * 而这时还没有到代码执行阶段，即：
     *
     * - tick1: 执行 move > 判断当前位置 > 不是传送门
     * - tick2: 更新位置 > 发现新位置在传送门上 > 发送到新 shard > 执行代码（creep 到了新 shard，当前位置依旧不在传送门上）
     *
     * 所以要在路径还有一格时判断前方是不是传送门
     */
    if (creep.memory.fromShard && moveMemory.path && moveMemory.path.length === 1) {
      const nextPos = creep.pos.directionToPos(direction);
      const portal = nextPos
        .lookFor(LOOK_STRUCTURES)
        .find(s => s.structureType === STRUCTURE_PORTAL) as StructurePortal;

      // 移动到去其他 shard 的传送门上了，发送跨 shard 请求
      if (portal && !(portal.destination instanceof RoomPosition)) {
        WayPoint.updateWayPoint(creep);
        const { name, memory } = creep as Creep;
        // 移除移动路径，到下个 shard 可以重新规划路径
        delete memory.moveInfo.path;
        console.log(`向 ${portal.destination.shard} 发送 sendCreep 任务`, JSON.stringify({ name, memory }));
        // 发送跨 shard 请求来转移自己的 memory
        addCrossShardRequest(`sendCreep${creep.name}${Game.time}`, portal.destination.shard as ShardName, "sendCreep", {
          name,
          memory
        });

        // 主动释放掉自己的内存，从而避免 creep 认为自己去世了而直接重新孵化
        // 这里因为上面已经执行了 move，所以下个 tick 就直接到目标 shard 了，不会报错找不到自己内存
        delete Memory.creeps[creep.name];

        return OK;
      } else if (portal && portal.destination instanceof RoomPosition) {
        WayPoint.updateWayPoint(creep);
      }
    }

    // 移动成功，更新路径
    if (goResult === OK) {
      // 移动到终点了，不需要再检查位置是否重复
      if (moveMemory.path.length === 0) {
        delete moveMemory.lastMove;
      } else {
        moveMemory.lastMove = Number(moveMemory.path[0]) as DirectionConstant;
        moveMemory.path = moveMemory.path.substr(1);
      }
    }
    // 其他异常直接报告
    else if (goResult !== ERR_TIRED) creep.say(`寻路 ${goResult}`);

    // 更新最后位置
    moveMemory.prePos = currentPos;

    return goResult;
  }

  public static goTo(
    creep: Creep | PowerCreep,
    targetPos: RoomPosition | undefined,
    moveOpt: MoveOpt = {}
  ): ScreepsReturnCode {
    const costBeforeGo = Game.cpu.getUsed();
    const result = this.goToInner(creep, targetPos, moveOpt);
    const moveUseCpu = Game.cpu.getUsed() - costBeforeGo;
    if (moveUseCpu > 0.2) {
      Memory.moveUseCpu = Memory.moveUseCpu === undefined ? 0 : Memory.moveUseCpu + moveUseCpu;
      Memory.moveNumber = Memory.moveNumber === undefined ? 0 : Memory.moveNumber + 1;
    }

    return result;
  }

  /**
   * 压缩 PathFinder 返回的路径数组
   *
   * @param creep 目标 creep
   * @param positions 房间位置对象数组，必须连续
   * @returns 压缩好的路径
   */
  private static serializeFarPath(creep: Creep | PowerCreep, positions: RoomPosition[]): string {
    if (positions.length === 0) return "";
    // 确保路径的第一个位置是自己的当前位置
    if (!positions[0].isEqualTo(creep.pos)) positions.splice(0, 0, creep.pos);

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
   * @param creep 目标 creep
   * @param target 目标位置
   * @param moveOpt
   * @returns PathFinder.search 的返回值
   */
  private static findPath(creep: Creep | PowerCreep, target: RoomPosition, moveOpt: MoveOpt = {}): string | undefined {
    // 先查询下缓存里有没有值
    const routeKey = `${creep.room.serializePos(creep.pos)} ${creep.room.serializePos(target)}`;

    if (!moveOpt.disableRouteCache) {
      const cachedRoute = this.routeCache[routeKey];
      // 如果有值则直接返回
      if (cachedRoute) return cachedRoute;
    }

    const range = moveOpt.range === undefined ? 1 : moveOpt.range;
    const result = PathFinder.search(
      creep.pos,
      { pos: target, range },
      {
        maxOps: moveOpt.maxOps || 4000,
        roomCallback: roomName => {
          // 强调了不许走就不走
          if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) return false;

          const room = Game.rooms[roomName];
          // 房间没有视野
          if (!room) return undefined;

          // 尝试从缓存中读取，没有缓存就进行查找
          let costs = roomName in this.costCache ? this.costCache[roomName].clone() : undefined;
          if (!costs) {
            costs = new PathFinder.CostMatrix();
            const terrain = new Room.Terrain(roomName);

            // 设置基础地形 cost
            for (let x = 0; x < 50; x++)
              for (let y = 0; y < 50; y++) {
                const tile = terrain.get(x, y);
                let weight = 0;
                if (tile === TERRAIN_MASK_WALL) weight = 255;
                else if (tile === TERRAIN_MASK_SWAMP) weight = 10;
                else if (x === 0 || x === 49 || y === 0 || y === 49) weight = 15;
                else weight = 2;

                costs.set(x, y, weight);
              }

            const addCost = (item: Structure | ConstructionSite) => {
              // 更倾向走道路
              if (item.structureType === STRUCTURE_ROAD) {
                // 造好的路可以走
                if (item instanceof Structure) costs.set(item.pos.x, item.pos.y, 1);
                // 路的工地消耗在路和平地之间
                else costs.set(item.pos.x, item.pos.y, 1.5);
              }
              // 不能穿过无法行走的建筑
              else if (
                item.structureType !== STRUCTURE_CONTAINER &&
                (item.structureType !== STRUCTURE_RAMPART || !item.my)
              )
                costs.set(item.pos.x, item.pos.y, 255);
            };

            // 给建筑和工地添加 cost
            room.find(FIND_CONSTRUCTION_SITES).forEach(addCost);
            room.find(FIND_STRUCTURES).forEach(addCost);

            this.costCache[room.name] = costs.clone();
          }

          // 躲避房间中的 creep
          room.find(FIND_CREEPS).forEach(otherCreep => {
            // 以下情况会躲避
            if (
              // 如果禁用对穿了
              moveOpt.disableCross ||
              // 或者对方不属于自己
              !otherCreep.my ||
              otherCreep.memory.disableCross ||
              // 或者对穿规则不允许
              !(crossRules[otherCreep.memory.role] || crossRules.default)(otherCreep, creep)
            ) {
              costs.set(otherCreep.pos.x, otherCreep.pos.y, 255);
            }
          });

          // 躲避房间中的非己方 powerCreep
          room.find(FIND_POWER_CREEPS).forEach(pc => {
            if (!pc.my) costs.set(pc.pos.x, pc.pos.y, 255);
          });

          // 跨 shard creep 需要解除目标 portal 的不可移动性（如果有的话）
          if (creep.memory.fromShard && target.roomName === roomName) {
            const portal = target.lookFor(LOOK_STRUCTURES).find(s => s.structureType === STRUCTURE_PORTAL);
            if (portal) costs.set(portal.pos.x, portal.pos.y, 2);
          }

          return costs;
        }
      }
    );

    // 没找到就返回空
    if (result.path.length <= 0) return undefined;
    // 找到了就进行压缩
    const route = this.serializeFarPath(creep, result.path);
    // 保存到全局缓存
    if (!result.incomplete) this.routeCache[routeKey] = route;

    // 根据玩家指定的重用距离返回缓存
    return moveOpt.reusePath ? route : route.slice(0, moveOpt.reusePath);
  }

  /**
   * 路径模式下获取要移动到的目标
   *
   * 会进行缓存
   * 如果内存中没有设置的话则返回 undefined
   */
  private static getTarget(creep: Creep | PowerCreep): RoomPosition {
    // 检查缓存
    let target = WayPoint.wayPointCache[creep.name];
    if (target) return target;

    const memory = creep.memory.moveInfo;
    if (!memory) return undefined;

    // 优先用路径旗帜
    if (memory.wayPointFlag) {
      const flag = Game.flags[memory.wayPointFlag];
      target = flag?.pos;
    }
    // 没有🚩就找找路径数组
    else if (memory.wayPoints && memory.wayPoints.length > 0) {
      const [x, y, roomName] = memory.wayPoints[0].split(" ");
      if (!x || !y || !roomName) {
        creep.log(`错误的路径点 ${memory.wayPoints[0]}`);
      } else target = new RoomPosition(Number(x), Number(y), roomName);
    }

    WayPoint.wayPointCache[creep.name] = target;

    // 如果还没有找到目标的话说明路径点失效了，移除整个缓存
    if (!target) delete creep.memory.moveInfo;

    return target;
  }
}
