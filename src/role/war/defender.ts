import { boostPrepare } from "@/utils/creep/boostPrepare";
import calcBodyPart from "@/utils/creep/calcBodyPart";

/**
 * 防御单位
 * 会自动攻击房间内的敌对单位
 * 注意身体部件不会自动适配，也就是说低等级房间无法造出来这个单位。原因在于低等级房间就算能造出来小 creep 也等于送人头。
 */
export const defender: CreepConfig<"defender"> = {
  // 委托 controller 判断房间内是否有威胁
  isNeed: room => {
    const needSpawn = room.controller.checkEnemyThreat();

    // 如果威胁已经解除了，就解除主动防御相关工作
    if (!needSpawn) {
      if (room.memory.boost) room.memory.boost.state = "boostClear";
      delete room.memory.war;
      delete room.memory.defenseMode;

      Game.notify(`[${room.name}][${Game.time}] 入侵威胁解除，已取消主动防御模式`);
    }
    return needSpawn;
  },
  ...boostPrepare(),
  target: creep => {
    let enemys: (Creep | PowerCreep)[] = creep.room.enemys;
    // 没有缓存则新建缓存
    if (!enemys) enemys = creep.room.enemys = creep.room.find(FIND_HOSTILE_CREEPS);
    if (enemys.length <= 0) enemys = creep.room.enemys = creep.room.find(FIND_HOSTILE_POWER_CREEPS);
    // 没有敌人就啥也不干
    if (enemys.length <= 0) return false;

    // 从缓存中获取敌人
    const enemy = creep.pos.findClosestByRange(creep.room.enemys);
    creep.say(`💢`);
    // 防止一不小心出房间了
    if (
      enemy.pos.x !== 0 &&
      enemy.pos.x !== 49 &&
      enemy.pos.y !== 0 &&
      enemy.pos.y !== 49 &&
      !creep.pos.isNearTo(enemy.pos)
    )
      creep.moveTo(enemy.pos);

    creep.attack(enemy);
    return false;
  },
  // 34 个 t3 强化的 ATTACK 可以造成 4.08K/T 的伤害，刚好可以打穿 12 个 T3 TOUGH
  bodys: () => calcBodyPart({ [TOUGH]: 6, [ATTACK]: 34, [MOVE]: 10 })
};
