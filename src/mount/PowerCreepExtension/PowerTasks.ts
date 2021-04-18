/**
 * 所有 power 的任务检查逻辑及工作逻辑
 *
 * @property PWR_* 常量之一，代表对应的任务
 * @value power 任务的具体配置项
 */
export const PowerTasks: IPowerTaskConfigs = {
  /**
   * 房间初始化任务，会在房间 power 任务队列初始化时同时添加
   * 该任务必定为房间的第一个 power 任务
   */
  [-1]: {
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => creep.enablePower()
  },

  /**
   * 生成 ops 并存放至 terminal
   * 注意，PWR_GENERATE_OPS 任务永远不会返回 OK，没有其他任务来打断它就会一直执行
   */
  [PWR_GENERATE_OPS]: {
    /**
     * 搓 ops，搓够指定数量就存一下
     */
    source: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      const actionResult = creep.usePower(PWR_GENERATE_OPS);

      // 如果
      if (actionResult === ERR_INVALID_ARGS) creep.enablePower();
      else if (actionResult !== OK) creep.log(`ops 生成异常, 错误码: ${actionResult}`, "red");

      // 数量够了就 target
      if (creep.store[RESOURCE_OPS] > 5) return OK;
      else return ERR_BUSY;
    },
    /**
     * 把 ops 存到 terminal 里
     */
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      // 塞不进去就乐观点，继续干其他的活
      if (!creep.room.terminal || creep.room.terminal.store.getFreeCapacity() < 5) return OK;

      const result = creep.transfer(creep.room.terminal, RESOURCE_OPS);

      // 够不到就移动
      if (result === ERR_NOT_IN_RANGE) {
        creep.goTo(creep.room.terminal.pos);
        return ERR_BUSY;
      }

      // ops 不足就继续生成
      else if (result === ERR_NOT_ENOUGH_RESOURCES) {
        return ERR_NOT_ENOUGH_RESOURCES;
      }
      return ERR_BUSY;
    }
  },

  /**
   * 填充 extension
   */
  [PWR_OPERATE_EXTENSION]: {
    // 获取能量
    source: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY =>
      creep.getOps(POWER_INFO[PWR_OPERATE_EXTENSION].ops),
    // 进行填充
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      // 资源不足直接执行 source
      if (creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_EXTENSION].ops) return ERR_NOT_ENOUGH_RESOURCES;

      // 获取能量来源
      let sourceStructure;
      // 只有 storage 的话就用 storage
      if (creep.room.storage && !creep.room.terminal) sourceStructure = creep.room.storage;
      // 两个都存在的话就比较那个能量多
      else if (creep.room.storage && creep.room.terminal) {
        sourceStructure =
          creep.room.storage.store[RESOURCE_ENERGY] > creep.room.terminal.store[RESOURCE_ENERGY]
            ? creep.room.storage
            : creep.room.terminal;
      }

      // 只有 terminal 的话就用 terminal
      else if (!creep.room.storage && creep.room.terminal) sourceStructure = creep.room.terminal;
      // 两个都不存在则直接完成任务
      else return OK;

      const actionResult = creep.usePower(PWR_OPERATE_EXTENSION, sourceStructure);

      if (actionResult === OK) return OK;
      else if (actionResult === ERR_NOT_IN_RANGE) {
        creep.goTo(creep.room.factory.pos);
        return ERR_BUSY;
      } else {
        creep.log(
          `[${creep.room.name} ${creep.name}] 执行 PWR_OPERATE_EXTENSION target 时出错，错误码 ${actionResult}`,
          "red"
        );
        return OK;
      }
    }
  },

  /**
   * 强化 factory
   */
  [PWR_OPERATE_FACTORY]: {
    source: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY =>
      creep.getOps(POWER_INFO[PWR_OPERATE_FACTORY].ops),
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      // 资源不足直接执行 source
      if (creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_FACTORY].ops) return ERR_NOT_ENOUGH_RESOURCES;

      // 如果自己的 power 等级和工厂等级对不上
      if (creep.powers[PWR_OPERATE_FACTORY].level !== creep.room.memory.factory.level) {
        creep.log(
          `自身 PWR_OPERATE_FACTORY 等级(${creep.powers[PWR_OPERATE_FACTORY].level})与工厂设置等级(${creep.room.memory.factory.level})不符，拒绝强化，任务已移除`,
          "yellow"
        );
        return OK;
      }

      const actionResult = creep.usePower(PWR_OPERATE_FACTORY, creep.room.factory);

      if (actionResult === OK) return OK;
      else if (actionResult === ERR_NOT_IN_RANGE) {
        creep.goTo(creep.room.factory.pos);
        return ERR_BUSY;
      } else {
        creep.log(
          `[${creep.room.name} ${creep.name}] 执行 PWR_OPERATE_FACTORY target 时出错，错误码 ${actionResult}`,
          "red"
        );
        return OK;
      }
    }
  },

  /**
   * 强化 source
   */
  [PWR_REGEN_SOURCE]: {
    // regen_source 不需要 ops，所以没有 source 阶段
    source: (): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => OK,
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      let target: Source;
      if (!creep.memory.targetIndex) {
        // 如果有 source 没有 regen_source 任务，则将其选为目标
        target = creep.room.source.find((s, index) => {
          if (!s.effects || !s.effects.map(e => e.effect).includes(PWR_REGEN_SOURCE)) {
            // 缓存目标
            creep.memory.targetIndex = index;
            return true;
          }
          return false;
        });
      }

      // 有缓存了就直接获取
      else target = creep.room.source[creep.memory.targetIndex];
      // 两个 source 都有 regen_source 时将获取不到 target
      if (!target) return ERR_BUSY;

      const actionResult = creep.usePower(PWR_REGEN_SOURCE, target);

      if (actionResult === OK) {
        // 移除缓存
        delete creep.memory.targetIndex;
        return OK;
      } else if (actionResult === ERR_NOT_IN_RANGE) {
        creep.goTo(target.pos);
        return ERR_BUSY;
      } else {
        creep.log(
          `[${creep.room.name} ${creep.name}] 执行 PWR_REGEN_SOURCE target 时出错，错误码 ${actionResult}`,
          "red"
        );
        return OK;
      }
    }
  },
  /**
   * 强化 spawn
   */
  [PWR_OPERATE_SPAWN]: {
    source: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY =>
      creep.getOps(POWER_INFO[PWR_OPERATE_SPAWN].ops),
    target: (creep: PowerCreep): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY => {
      // 资源不足直接执行 source
      if (creep.store[RESOURCE_OPS] < POWER_INFO[PWR_OPERATE_SPAWN].ops) return ERR_NOT_ENOUGH_RESOURCES;
      let target: StructureSpawn;
      if (!creep.memory.targetIndex) {
        // 如果有 spawn 没有 operate_spawn 任务，则将其选为目标
        target = creep.room.spawn.find((s, index) => {
          if (s.spawning && (!s.effects || !s.effects.map(e => e.effect).includes(PWR_OPERATE_SPAWN))) {
            // 缓存目标
            creep.memory.targetIndex = index;
            return true;
          }
          return false;
        });
      }

      // 有缓存了就直接获取
      else target = creep.room.spawn[creep.memory.targetIndex];
      // spawn 都有 operate_spawn 时将获取不到 target
      if (!target) return ERR_BUSY;

      const actionResult = creep.usePower(PWR_OPERATE_SPAWN, target);

      if (actionResult === OK) {
        // 移除缓存
        delete creep.memory.targetIndex;
        return OK;
      } else if (actionResult === ERR_NOT_IN_RANGE) {
        creep.goTo(target.pos);
        return ERR_BUSY;
      } else {
        creep.log(
          `[${creep.room.name} ${creep.name}] 执行 PWR_OPERATE_SPAWN target 时出错，错误码 ${actionResult}`,
          "red"
        );
        return OK;
      }
    }
  }
};
