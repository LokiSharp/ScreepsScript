/**
 * 战斗小队模块
 * 实现了两人以上 creep 组成小组后的战斗逻辑，详见 doc/战斗小队设计案.md
 */
export class CombatSquad {
  /**
   * 小队战术动作
   * 每个战术动作都有一套对应的位置交换 map，例如：
   * ↖ : ↗（左上队员移动到右上）
   * ↙ : ↘（坐下队员移动到右下）
   */
  public static tactical: {
    back: { "↖": "↘"; "↗": "↙"; "↙": "↗"; "↘": "↖" };
    cross: { "↖": "↘"; "↗": "↙"; "↙": "↗"; "↘": "↖" };
    right: { "↖": "↗"; "↗": "↘"; "↘": "↙"; "↙": "↖" };
    left: { "↗": "↖"; "↘": "↗"; "↙": "↘"; "↖": "↙" };
  };

  /**
   * 小队成员到队长（左上角 creep）的相对定位
   * 键为队员的名字，值为其坐标偏移量: [0] 为 x 坐标，[1] 为 y 坐标
   */
  public static relativePos: IRelativePos = {
    "↖": [0, 0],
    "↗": [1, 0],
    "↙": [0, 1],
    "↘": [1, 1]
  };

  /**
   * 检查队形
   *
   * @param squad 小队成员
   * @returns 是否需要重整队伍
   */
  public static checkFormation(squad: SquadMember): boolean {
    const leaderPos = squad["↖"].pos;

    // 遍历所有队友位置进行检查
    for (const name in squad) {
      // 如果不包含就跳过（一般都是队长）
      if (!(name in this.relativePos)) continue;

      // 检查其位置和队长的相对位置是否不正确
      if (
        !squad[name as SquadMemberName].pos.isEqualTo(
          leaderPos.x + this.relativePos[name as SquadMemberName][0],
          leaderPos.y + this.relativePos[name as SquadMemberName][1]
        )
      )
        return true;
    }

    // 位置都正确，不需要重新组队
    return false;
  }

  /**
   * 重新整队
   *
   * @param squad 小队成员
   * @returns 是否集结完成
   */
  public static regroup(squad: SquadMember): boolean {
    const leaderPos = squad["↖"].pos;
    // 是否集结完成
    let complete = true;

    for (const name in squad) {
      // 如果不包含就跳过（一般都是队长）
      if (!(name in this.relativePos)) continue;

      // 该队员应在的正确位置
      const correctPos: [number, number] = [
        leaderPos.x + this.relativePos[name as SquadMemberName][0],
        leaderPos.y + this.relativePos[name as SquadMemberName][1]
      ];

      // 如果位置不对的话，就移动到正确的位置上
      if (!squad[name].pos.isEqualTo(...correctPos)) {
        squad[name].moveTo(correctPos[0], correctPos[1], { reusePath: 1 });
        complete = false;
      }
    }

    return complete;
  }
}
