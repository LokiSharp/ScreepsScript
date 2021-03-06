/**
 * 所有小队的具体战斗逻辑
 */
export const squadStrategies: {
  [squadType in SquadTypes]: SquadStrategy;
} = {
  // 一体机 * 4
  rangedAttacker4: {
    // 小队组成
    member: {
      rangedAttacker: 4
    },

    /**
     * 小队进行治疗
     * 会计算血量最低的队员需要多少个队员治疗才能奶满，剩下的队友会自己奶自己
     *
     * @param squad 小队成员
     * @returns OK 小队可以奶回自己
     * @returns ERR_FULL 小队已经无法拉回自己的血量了
     */
    heal(squad: SquadMember): OK | ERR_FULL {
      // 进行血量降序排列
      const hitsSortedSquad = _.sortBy(Object.values(squad), creep => -creep.hits);
      // 计算每个队员能造成的治疗量，后面 * 3 是默认 HEAL 被 T3 强化过了
      const healValue = hitsSortedSquad[0].getActiveBodyparts(HEAL) * 12 * 3;

      // 计算一下血量最少的队员需要多少个队友治疗才能奶满
      const needHealNumber = Math.ceil((5000 - hitsSortedSquad[0].hits) / healValue);

      // 从血量最高的开始，弹出需要的 creep 对血量最低的进行治疗
      for (let i = 0; i < needHealNumber; i++) {
        const creep = hitsSortedSquad.shift();
        creep.heal(hitsSortedSquad[hitsSortedSquad.length - 1]);
      }

      // 剩下的队员就奶自己
      hitsSortedSquad.forEach(creep => creep.heal(creep));

      return needHealNumber >= 3 ? ERR_FULL : OK;
    },

    /**
     * 小队攻击敌方单位
     *
     * @param squad 小队成员
     */
    attackCreep(squad: SquadMember): OK | ERR_NOT_FOUND {
      const leader = squad["↖"];

      /**
       * 搜索小队攻击范围内（3格）的 creep
       * 注意下面的范围做了超出检测
       * 右侧的范围 +4 的原因是因为这个范围是以队长（左上角）为原点进行查找的，而小队是宽两格的
       */
      const nearCreeps = leader.room.lookForAtArea(
        LOOK_CREEPS,
        leader.pos.x < 3 ? 0 : leader.pos.x - 3,
        leader.pos.y < 3 ? 0 : leader.pos.y - 3,
        leader.pos.x > 45 ? 49 : leader.pos.x + 4,
        leader.pos.y > 45 ? 49 : leader.pos.y + 4,
        true
      );

      // 筛选出敌对 creep
      const hostileCreeps = nearCreeps.filter(item => !item.creep.my).map(item => item.creep);

      if (hostileCreeps.length <= 0) return ERR_NOT_FOUND;

      // 找到血量最低且不在 rampart 里的敌方 creep
      const target = _.max(hostileCreeps, creep => {
        // 该 creep 是否在 rampart 中
        const inRampart = creep.pos.lookFor(LOOK_STRUCTURES).find(s => s.structureType === STRUCTURE_RAMPART);

        // 在 rampart 里就不会作为进攻目标
        if (inRampart) return Infinity;
        // 找到血量最低的
        else return -creep.hits;
      });

      if (target) {
        // 遍历小队成员进行攻击
        Object.values(squad).forEach(creep => {
          const range = creep.pos.getRangeTo(creep);

          if (range === 1) creep.rangedMassAttack();
          else if (range <= 3) creep.rangedAttack(creep);
          else creep.rangedAttackNearestHostileCreeps(hostileCreeps);
        });
        return OK;
      }
      // 没找到目标就自行攻击
      else Object.values(squad).forEach(creep => creep.rangedAttackNearestHostileCreeps(hostileCreeps));
      return ERR_NOT_FOUND;
    },

    /**
     * 小队攻击敌方建筑
     *
     * @param squad 小队成员
     * @param memory 小队 Memory
     * @returns OK 攻击敌方建筑
     * @returns ERR_NOT_FOUND 未找到建筑
     */
    attackStructure(squad: SquadMember, memory: SquadMemory): OK | ERR_NOT_FOUND {
      // 从内存中加载缓存建筑
      let targets = memory.targetStructures.map(id => Game.getObjectById(id));
      targets = targets.filter(Boolean);

      // 都杀光了，重新搜索
      if (targets.length <= 0) {
        targets = squad["↖"].room.find(FIND_HOSTILE_STRUCTURES, {
          filter: s => s.structureType !== STRUCTURE_KEEPER_LAIR && s.structureType !== STRUCTURE_CONTROLLER
        });
      }

      // 还没搜到，就真都杀光了
      if (targets.length <= 0) return ERR_NOT_FOUND;

      // 找到血量最低的建筑
      const target = _.max(targets, s => -s.hits);

      // 遍历所有队友执行攻击
      Object.values(squad).forEach(creep => {
        const range = creep.pos.getRangeTo(target);

        if (range === 1 || range > 3) creep.rangedMassAttack();
        else creep.rangedAttack(target);
      });

      return OK;
    },

    /**
     * 寻路回调
     *
     * @param roomName 所在房间
     * @param costs 该房间的 costs
     */
    findPathCallback(roomName: string, costs: CostMatrix): CostMatrix {
      return costs;
    },

    /**
     * 决定移动方向
     *
     * @param healResult heal 方法的执行结果
     * @param attackCreepResult attackCreep 方法的执行结果
     * @param attackStructureResult attackStructure 方法的执行结果
     * @returns 是否继续前进（为 false 则后撤）
     */
    getMoveStrategy(
      healResult: OK | ERR_FULL,
      attackCreepResult: OK | ERR_NOT_FOUND,
      attackStructureResult: OK | ERR_NOT_FOUND
    ): boolean {
      if (healResult === ERR_FULL) return true;
      else if (attackCreepResult === ERR_NOT_FOUND && attackStructureResult === OK) return true;
      else if (attackCreepResult === OK && attackStructureResult === ERR_NOT_FOUND) return true;
      return false;
    }
  }
};
