import { addCrossShardRequest } from "./crossShard";
import crossRules from "./crossRules";
import { getOppositeDirection } from "utils/getOppositeDirection";

/**
 * 房间移动成本缓存
 *
 * 会缓存房间内的静态地形、道路、建筑等短时间内不会移动的对象
 * 如果出现了撞墙等情况，说明缓存过期，会在撞墙时移除缓存以便下次重新搜索
 */
const costCache: { [roomName: string]: CostMatrix } = {};

/**
 * 路径缓存
 *
 * Creep 在执行远程寻路时会优先检查该缓存
 * 键为路径的起点和终点名，例如："12/32/W1N1 23/12/W2N2"，值是使用 serializeFarPath 序列化后的路径
 */
export const routeCache: { [routeKey: string]: string } = {};

/**
 * 路径点缓存
 *
 * Creep 会把自己下一个路径点对应的位置缓存在这里，这样就不用每 tick 都从内存中的路径点字符串重建位置
 * 不过这么做会导致 creep 无法立刻感知到位置的变化
 *
 * 其键为 creep 的名字，值为下一个路径目标
 */
const wayPointCache: { [creepName: string]: RoomPosition } = {};

/**
 * 压缩 PathFinder 返回的路径数组
 *
 * @param positions 房间位置对象数组，必须连续
 * @returns 压缩好的路径
 */
const serializeFarPath = function (creep: Creep, positions: RoomPosition[]): string {
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
};

/**
 * 给 Creep 设置路径点目标
 *
 * target 是一个路径数组或者路径旗帜
 *
 * @param target 路径点目标
 */
export const setWayPoint = function (creep: Creep, target: string[] | string): CreepMoveReturnCode {
  if (!creep.memory.moveInfo) creep.memory.moveInfo = {};
  delete wayPointCache[creep.name];

  // 设置时会移除另一个路径模式的数据，防止这个移动完之后再回头走之前留下的路径点
  if (target instanceof Array) {
    creep.memory.moveInfo.wayPoints = target;
    delete creep.memory.moveInfo.wayPointFlag;
  } else {
    creep.memory.moveInfo.wayPointFlag = target + "0";
    delete creep.memory.moveInfo.wayPoints;
  }

  return OK;
};

/**
 * 更新路径点
 *
 * 当抵达当前路径点后就需要更新内存数据以移动到下一个路径点
 */
const updateWayPoint = function (creep: Creep) {
  if (!creep.memory.moveInfo) creep.memory.moveInfo = {};
  const memory = creep.memory.moveInfo;

  if (memory.wayPoints) {
    // 弹出已经抵达的路径点
    if (memory.wayPoints.length > 0) memory.wayPoints.shift();
  } else if (memory.wayPointFlag) {
    const preFlag = Game.flags[memory.wayPointFlag];

    // 如果旗帜内存里指定了下一个路径点名称的话就直接使用
    if (preFlag && preFlag.memory && preFlag.memory.next) {
      memory.wayPointFlag = preFlag.memory.next;
    }
    // 否则就默认自增编号
    else {
      // 获取路径旗帜名
      const flagPrefix = memory.wayPointFlag.slice(0, memory.wayPointFlag.length - 1);
      // 把路径旗帜的编号 + 1
      const nextFlagCode = Number(memory.wayPointFlag.substr(-1)) + 1;
      // 把新旗帜更新到内存，这里没有检查旗帜是否存在
      // 原因在于跨 shard 需要在跨越之前将旗帜更新到下一个，但是这时还没有到下个 shard，就获取不到位于下个 shard 的旗帜
      memory.wayPointFlag = flagPrefix + nextFlagCode.toString();
    }
  }

  // 移除缓存以便下次可以重新查找目标
  delete wayPointCache[creep.name];
};

/**
 * 请求对穿
 * 自己内存中 stand 为 true 时将拒绝对穿
 *
 * @param creep 被请求对穿的 creep
 * @param direction 请求该 creep 进行对穿
 * @param requireCreep 发起请求的 creep
 */
const requireCross = function (creep: Creep, direction: DirectionConstant, requireCreep: Creep): ScreepsReturnCode {
  // creep 下没有 memory 说明 creep 已经凉了，直接移动即可
  if (!creep.memory) return OK;

  // 获取对穿规则并进行判断
  const allowCross = crossRules[creep.memory.role] || crossRules.default;
  if (!allowCross(creep, requireCreep)) {
    creep.say("👊");
    creep.log(`拒绝对穿！${requireCreep.name} ${direction}`);
    return ERR_BUSY;
  } else {
    // 同意对穿
    creep.say("👌");
    creep.log(`同意对穿！${requireCreep.name} ${direction}`);
    const moveResult = creep.move(direction);
    if (moveResult === OK && creep.memory.moveInfo?.path?.length > 0) {
      // 如果移动的方向就是
      if ((Number(creep.memory.moveInfo.path[0]) as DirectionConstant) !== direction) {
        delete creep.memory.moveInfo.path;
        delete creep.memory.moveInfo.prePos;
      }
    }
    return moveResult;
  }
};

/**
 * 向指定方向发起对穿
 *
 * @param creep 发起对穿的 creep
 * @param direction 要进行对穿的方向
 * @param fontCreep 要被对穿的 creep
 *
 * @returns OK 成功对穿
 * @returns ERR_BUSY 对方拒绝对穿
 * @returns ERR_INVALID_TARGET 前方没有 creep
 */
const mutualCross = function (
  creep: Creep,
  direction: DirectionConstant,
  fontCreep: Creep
): OK | ERR_BUSY | ERR_INVALID_TARGET {
  creep.say(`👉`);
  creep.log(`发起对穿！${fontCreep.name} ${direction}`);

  // 如果前面的 creep 同意对穿了，自己就朝前移动
  const reverseDirection = getOppositeDirection(direction);
  const fontMoveResult = requireCross(fontCreep, reverseDirection, creep);
  if (fontMoveResult !== OK) return ERR_BUSY;

  const selfMoveResult = creep.move(direction);
  return selfMoveResult === OK && fontMoveResult === OK ? OK : ERR_BUSY;
};

/**
 * 远程寻路
 *
 * @param target 目标位置
 * @param range 搜索范围 默认为 1
 * @returns PathFinder.search 的返回值
 */
const findPath = function (creep: Creep, target: RoomPosition, moveOpt: MoveOpt = {}): string | undefined {
  // 先查询下缓存里有没有值
  const routeKey = `${creep.room.serializePos(creep.pos)} ${creep.room.serializePos(target)}`;
  let route = routeCache[routeKey];
  // 如果有值则直接返回
  if (route) {
    return route;
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
        let costs = roomName in costCache ? costCache[roomName].clone() : undefined;
        if (!costs) {
          costs = new PathFinder.CostMatrix();
          const terrain = new Room.Terrain(roomName);

          // 设置基础地形 cost
          for (let x = 0; x < 50; x++)
            for (let y = 0; y < 50; y++) {
              const tile = terrain.get(x, y);
              const weight = tile === TERRAIN_MASK_WALL ? 255 : tile === TERRAIN_MASK_SWAMP ? 10 : 2;

              costs.set(x, y, weight);
            }

          const addCost = (item: Structure | ConstructionSite) => {
            // 更倾向走道路
            if (item.structureType === STRUCTURE_ROAD) {
              // 造好的路可以走
              if (item instanceof Structure) costs.set(item.pos.x, item.pos.y, 1);
              // 路的工地保持原有 cost
              else return;
            }
            // 不能穿过无法行走的建筑
            else if (
              item.structureType !== STRUCTURE_CONTAINER &&
              (item.structureType !== STRUCTURE_RAMPART || !item.my)
            )
              costs.set(item.pos.x, item.pos.y, 255);
          };

          // 给建筑和工地添加 cost
          room.find(FIND_STRUCTURES).forEach(addCost);
          room.find(FIND_CONSTRUCTION_SITES).forEach(addCost);

          costCache[room.name] = costs.clone();
        }

        // 躲避房间中的 creep
        const addCreepCost = (otherCreep: Creep) => {
          // 以下情况会躲避
          if (
            // 如果禁用对穿了
            moveOpt.disableCross ||
            otherCreep.memory.disableCross ||
            // 或者对方不属于自己
            !otherCreep.my ||
            // 或者对穿规则不允许
            !(crossRules[otherCreep.memory.role] || crossRules.default)(otherCreep, creep)
          ) {
            costs.set(otherCreep.pos.x, otherCreep.pos.y, 255);
          }
        };

        room.find(FIND_CREEPS).forEach(addCreepCost);

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
  route = serializeFarPath(creep, result.path);
  // 保存到全局缓存
  if (!result.incomplete) routeCache[routeKey] = route;

  // 根据玩家指定的重用距离返回缓存
  return moveOpt.reusePath ? route : route.slice(0, moveOpt.reusePath);
};

/**
 * 路径模式下获取要移动到的目标
 *
 * 会进行缓存
 * 如果内存中没有设置的话则返回 undefined
 */
const getTarget = function (creep: Creep): RoomPosition {
  // 检查缓存
  let target = wayPointCache[creep.name];
  if (target) return target;

  const memroy = creep.memory.moveInfo;
  if (!memroy) return undefined;

  // 优先用路径旗帜
  if (memroy.wayPointFlag) {
    const flag = Game.flags[memroy.wayPointFlag];
    target = flag?.pos;
  }
  // 没有🚩就找找路径数组
  else if (memroy.wayPoints && memroy.wayPoints.length > 0) {
    const [x, y, roomName] = memroy.wayPoints[0].split(" ");
    if (!x || !y || !roomName) {
      creep.log(`错误的路径点 ${memroy.wayPoints[0]}`);
    } else target = new RoomPosition(Number(x), Number(y), roomName);
  }

  wayPointCache[creep.name] = target;

  // 如果还没有找到目标的话说明路径点失效了，移除整个缓存
  if (!target) delete creep.memory.moveInfo;

  return target;
};

/**
 * 移动 creep
 *
 * @param creep 要进行移动的 creep
 * @param target 要移动到的目标位置
 * @param moveOpt 移动参数
 */
export const goTo = function (
  creep: Creep,
  targetPos: RoomPosition | undefined,
  moveOpt: MoveOpt = {}
): ScreepsReturnCode {
  if (!creep.memory.moveInfo) creep.memory.moveInfo = {};
  const moveMemory = creep.memory.moveInfo;
  // 如果没有指定目标的话则默认为路径模式
  const target: RoomPosition = targetPos || getTarget(creep);
  if (!target) return ERR_INVALID_ARGS;

  const currentPos = `${creep.pos.x}/${creep.pos.y}`;

  // 确认目标有没有变化, 变化了则重新规划路线
  if (moveOpt.checkTarget) {
    const targetPosTag = creep.room.serializePos(target);

    if (targetPosTag !== moveMemory.targetPos) {
      moveMemory.targetPos = targetPosTag;
      delete moveMemory.path;
      delete moveMemory.prePos;
    }
  }

  // 确认缓存有没有被清除
  if (!moveMemory.path) {
    moveMemory.path = findPath(creep, target, moveOpt);
  }
  // 之前有缓存说明已经在移动了，检查上一 tick 移动是否成功
  // （因为上一步的移动结果在这一 tick 开始时才会更新，所以要先检查之前移动是否成功，然后再决定是否要继续移动）
  else {
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

      const fontCreep = fontPos.lookFor(LOOK_CREEPS)[0];

      // 前方不是 creep 或者不是自己的 creep 或者内存被清空（正在跨越 shard）的话就不会发起对穿
      if (!fontCreep || !fontCreep.my || Object.keys(fontCreep.memory).length <= 0) {
        delete moveMemory.path;
        delete moveMemory.prePos;
        return ERR_INVALID_TARGET;
      }
      // 尝试对穿，如果自己禁用了对穿的话则直接重新寻路
      const crossResult = moveOpt.disableCross ? ERR_BUSY : mutualCross(creep, moveMemory.lastMove, fontCreep);

      // 对穿失败说明撞墙上了或者前面的 creep 拒绝对穿，重新寻路
      if (crossResult !== OK) {
        delete creep.memory.moveInfo.path;
        delete creep.memory.moveInfo.prePos;
        // ERR_BUSY 代表了前面 creep 拒绝对穿，所以不用更新房间 Cost 缓存
        if (crossResult !== ERR_BUSY) delete costCache[creep.room.name];
      }

      // 对穿失败，需要重新寻路，不需要往下继续执行
      // 对穿成功，相当于重新执行了上一步，也不需要继续往下执行
      return crossResult;
    }
  }

  // 还为空的话就是没找到路径或者已经到了
  if (!creep.memory.moveInfo.path) {
    // 到达目的地后如果是路径模式的话就需要更新路径点
    if (!targetPos) updateWayPoint(creep);
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
  if (creep.memory.fromShard && creep.memory.moveInfo.path && creep.memory.moveInfo.path.length === 1) {
    const nextPos = creep.pos.directionToPos(direction);
    const portal = nextPos.lookFor(LOOK_STRUCTURES).find(s => s.structureType === STRUCTURE_PORTAL) as StructurePortal;

    // 移动到去其他 shard 的传送门上了，发送跨 shard 请求
    if (portal && !(portal.destination instanceof RoomPosition)) {
      updateWayPoint(creep);
      const { name, memory } = creep;
      // 移除移动路径，到下个 shard 可以重新规划路径
      delete memory.moveInfo.path;
      console.log(`向 ${portal.destination.shard} 发送 sendCreep 任务`, JSON.stringify({ name, memory }));
      // 发送跨 shard 请求来转移自己的 memory
      addCrossShardRequest(`sendCreep${creep.name}${Game.time}`, portal.destination.shard as ShardName, "sendCreep", {
        name,
        memory
      });

      // 主动释放掉自己的内存，从而避免 creepController 认为自己去世了而直接重新孵化
      // 这里因为上面已经执行了 move，所以下个 tick 就直接到目标 shard 了，不会报错找不到自己内存
      delete Memory.creeps[creep.name];

      return OK;
    } else if (portal && portal.destination instanceof RoomPosition) {
      updateWayPoint(creep);
    }
  }

  // 移动成功，更新路径
  if (goResult === OK) {
    moveMemory.prePos = currentPos;
    moveMemory.lastMove = Number(moveMemory.path.substr(0, 1)) as DirectionConstant;
    creep.memory.moveInfo.path = creep.memory.moveInfo.path.substr(1);
  }
  // 如果发生撞停或者参数异常的话说明缓存可能存在问题，移除缓存
  else if (goResult === ERR_BUSY) {
    delete creep.memory.moveInfo.path;
    delete creep.memory.moveInfo.prePos;
    delete costCache[creep.room.name];
  }
  // 其他异常直接报告
  else if (goResult !== ERR_TIRED) creep.say(`寻路 ${goResult}`);

  return goResult;
};

export const visualAllCreepPath = function (): void {
  Object.values(Game.creeps).forEach(creep => {
    if (!creep.memory.moveInfo || !creep.memory.moveInfo.path) return;

    const directions: (string | RoomPosition)[] = creep.memory.moveInfo.path.split("");
    directions.unshift(creep.pos);
    directions.reduce((pre: RoomPosition, next: string) => {
      const nextPos = pre.directionToPos((next as unknown) as DirectionConstant);
      console.log("visualAllCreepPath -> nextPos", nextPos);
      new RoomVisual(pre.roomName).line(pre, nextPos, { color: "#a9b7c6", lineStyle: "dashed" });

      return nextPos;
    });
  });
};
