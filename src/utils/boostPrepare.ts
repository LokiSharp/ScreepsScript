/**
 * Boost Creep 准备阶段
 * 本方法抽象出了 boost Creep 通用的 isNeed 阶段和 prepare 阶段
 *
 * @param boostType BOOST.TYPE 类型之一
 */
export const boostPrepare = (): IBoostPrepare => ({
  /**
   * 移动至强化位置并执行强化
   * @danger 该位置是 Room.memory.boost.pos 中定义的，并不是旗帜的实时位置，该逻辑有可能会导致迷惑
   */
  prepare: (creep: Creep) => {
    // 获取强化位置
    const boostTask = creep.room.memory.boost;
    if (boostTask.state !== "waitBoost") {
      creep.say("boost 未准备就绪");
      return false;
    }
    const boostPos = new RoomPosition(boostTask.pos[0], boostTask.pos[1], creep.room.name);

    // 抵达了强化位置就开始强化
    if (creep.pos.isEqualTo(boostPos)) {
      const boostResult = creep.room.boostCreep(creep);

      if (boostResult === OK) {
        creep.say("💥 强化完成");
        return true;
      } else {
        creep.log(`强化失败 ${boostResult}`, "red");
        return false;
      }
    }
    // 否则就继续移动
    else creep.goTo(boostPos, { range: 0 });
    return false;
  }
});
