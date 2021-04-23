export { PowerCreepExtension } from "./PowerCreepExtension";

/**
 * 把已经孵化的 pc 能力注册到其所在的房间上
 * 方便房间内其他 RoomObject 查询并决定是否发布 power 任务
 */
export function mountPowerToRoom(): void {
  Object.values(Game.powerCreeps).forEach(pc => {
    if (!pc.room) return;
    pc.room.power.addSkill(pc);
  });
}
