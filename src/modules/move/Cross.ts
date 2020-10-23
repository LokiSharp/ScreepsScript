import crossRules from "./crossRules";
import { getOppositeDirection } from "utils/getOppositeDirection";

export class Cross {
  /**
   * 请求对穿
   * 自己内存中 stand 为 true 时将拒绝对穿
   *
   * @param creep 被请求对穿的 creep
   * @param direction 请求该 creep 进行对穿
   * @param requireCreep 发起请求的 creep
   */
  private static requireCross(creep: Creep, direction: DirectionConstant, requireCreep: Creep): ScreepsReturnCode {
    // creep 下没有 memory 说明 creep 已经凉了，直接移动即可
    if (!creep.memory) return OK;

    // 获取对穿规则并进行判断
    const allowCross = crossRules[creep.memory.role] || crossRules.default;
    if (!allowCross(creep, requireCreep)) {
      creep.say("👊");
      return ERR_BUSY;
    } else {
      // 同意对穿
      creep.say("👌");
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
  }
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
  public static mutualCross(
    creep: Creep,
    direction: DirectionConstant,
    fontCreep: Creep
  ): OK | ERR_BUSY | ERR_INVALID_TARGET {
    creep.say(`👉`);

    // 如果前面的 creep 同意对穿了，自己就朝前移动
    const reverseDirection = getOppositeDirection(direction);
    const fontMoveResult = this.requireCross(fontCreep, reverseDirection, creep);
    if (fontMoveResult !== OK) return ERR_BUSY;

    const selfMoveResult = creep.move(direction);
    return selfMoveResult === OK && fontMoveResult === OK ? OK : ERR_BUSY;
  }
}
