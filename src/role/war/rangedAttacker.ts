import { battleBase } from "utils/creep/battleBase";
import { boostPrepare } from "utils/creep/boostPrepare";
import calcBodyPart from "utils/creep/calcBodyPart";

/**
 * 强化 - 重型作战单位
 * 本角色仅能在 RCL >= 7 时生成
 * 扛塔数量为 0 时依旧会携带 3 个强化 HEAL (144/T 的回复)，但是不会有 TOUGH
 *
 * @param spawnRoom 出生房间名称
 * @param bearTowerNum 可以承受多少 tower 的最大伤害，该数值越少，攻击能力越强，默认为 6 (0~6)
 * @param flagName 要攻击的旗帜名称
 */
export default function rangedAttacker(data: RangedAttackerData): ICreepConfig {
  // 越界就置为 6
  if (data.bearTowerNum < 0 || data.bearTowerNum > 6) data.bearTowerNum = 6;
  // 扛塔等级和bodyPart的对应关系
  const bodyMap = {
    0: { [TOUGH]: 0, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 3 },
    1: { [TOUGH]: 2, [RANGED_ATTACK]: 15, [MOVE]: 6, [HEAL]: 5 },
    2: { [TOUGH]: 4, [RANGED_ATTACK]: 20, [MOVE]: 9, [HEAL]: 9 },
    3: { [TOUGH]: 6, [RANGED_ATTACK]: 21, [MOVE]: 10, [HEAL]: 13 },
    4: { [TOUGH]: 8, [RANGED_ATTACK]: 15, [MOVE]: 10, [HEAL]: 17 },
    5: { [TOUGH]: 10, [RANGED_ATTACK]: 9, [MOVE]: 10, [HEAL]: 21 },
    6: { [TOUGH]: 12, [RANGED_ATTACK]: 5, [MOVE]: 10, [HEAL]: 23 }
  };
  const bodyConfig: BodySet = bodyMap[data.bearTowerNum];

  // 组装 CreepConfig
  return {
    ...battleBase(data.targetFlagName, data.keepSpawn),
    ...boostPrepare(),
    target: creep => {
      // 获取旗帜
      const targetFlag = creep.getFlag(data.targetFlagName);
      if (!targetFlag) {
        creep.say("旗呢?");
        return false;
      }

      // 治疗自己，不会检查自己生命值，一直治疗
      // 因为本 tick 受到的伤害只有在下个 tick 才能发现，两个 tick 累计的伤害足以击穿 tough。
      if (creep.getActiveBodyparts(HEAL)) creep.heal(creep);

      // 如果 creep 不在房间里 则一直向旗帜移动
      if (!targetFlag.room || (targetFlag.room && creep.room.name !== targetFlag.room.name)) {
        // 如果 healer 存在则只会在 healer 相邻且可以移动时才进行移动
        creep.goTo(targetFlag.pos, {
          checkTarget: true
        });
      }

      if (creep.room.name === targetFlag.pos.roomName) {
        const rangedMassAttackAbleEnemys = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 2);
        const rangedAttackAbleEnemys = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 6);

        creep.memory.massMode = rangedMassAttackAbleEnemys.length > 1;
        // 根据 massMode 选择不同给攻击模式
        if (creep.memory.massMode) creep.rangedMassAttack();
        else {
          const structures = targetFlag.pos.lookFor(LOOK_STRUCTURES);

          if (structures.length > 0) {
            if (creep.rangedAttack(structures[0]) === ERR_NOT_IN_RANGE) creep.moveTo(structures[0]);
          } else if (rangedAttackAbleEnemys.length > 0) creep.rangedAttack(rangedMassAttackAbleEnemys[0]);
          else {
            let target;
            const targetStructureTypes = [STRUCTURE_TOWER, STRUCTURE_NUKER, STRUCTURE_SPAWN, STRUCTURE_EXTENSION];

            for (const structureType of targetStructureTypes) {
              const targetCache = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: { structureType }
              });
              if (targetCache) {
                target = targetCache;
                break;
              }
            }

            if (target && creep.rangedAttack(target) === ERR_NOT_IN_RANGE) creep.moveTo(target);
          }
        }
      } else {
        creep.log(`不在指定房间，切入迁徙模式`);
        return true;
      }
      return false;
    },
    bodys: () => calcBodyPart(bodyConfig)
  };
}
