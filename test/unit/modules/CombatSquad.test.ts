import { CombatSquad } from "../../../src/modules/CombatSquad/CombatSquad";
import CreepMock from "../mock/CreepMock";
import { assert } from "chai";

describe("checkFormation", () => {
  it("检查阵型正确时返回 False", () => {
    const squadMembersDef: (string | number[] | Record<string, any[]>[])[][] = [
      ["↖", [0, 0], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isFalse(result);
  });

  it("检查阵型错误时返回 True", () => {
    const squadMembersDef: (string | number[] | Record<string, any[]>[])[][] = [
      ["↖", [2, 2], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isTrue(result);
  });
});

describe("regroup", () => {
  it("都在正确位置时返回 True", () => {
    const squadMembersDef: (string | number[] | Record<string, any[]>[])[][] = [
      ["↖", [0, 0], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isTrue(result);
    assertSquadMember(squad, squadMembersDef);
  });

  it("位置不对时返回 False", () => {
    const squadMembersDef: (string | number[] | Record<string, any[]>[])[][] = [
      ["↖", [0, 0], []],
      ["↗", [1, 1], [{ moveTo: [1, 0, { reusePath: 1 }] }]],
      ["↙", [2, 2], [{ moveTo: [0, 1, { reusePath: 1 }] }]],
      ["↘", [3, 3], [{ moveTo: [1, 1, { reusePath: 1 }] }]]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isFalse(result);
    assertSquadMember(squad, squadMembersDef);
  });
});

function initSquadMember(
  squad: SquadMember,
  squadMembersDef: (string | number[] | Record<string, any[]>[])[][]
): SquadMember {
  squadMembersDef.forEach(
    item =>
      (squad[item[0] as string] = (new CreepMock(
        "" as Id<CreepMock>,
        item[1][0] as number,
        item[1][1] as number
      ) as unknown) as Creep)
  );
  return squad;
}

function assertSquadMember(
  squad: SquadMember,
  squadMembersDef: (string | number[] | Record<string, any[]>[])[][]
): void {
  squadMembersDef.forEach(item =>
    assert.deepEqual(((squad[item[0] as string] as unknown) as CreepMock).called, item[2] as Record<string, any[]>[])
  );
}
