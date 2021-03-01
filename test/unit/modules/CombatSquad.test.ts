import { CombatSquad } from "@/modules/CombatSquad/CombatSquad";
import CreepMock from "@mock/CreepMock";
import { assert } from "chai";

describe("CombatSquad", () => {
  it("CombatSquad 可以初始化", () => {
    const combatSquad = new CombatSquad();
    assert.isDefined(combatSquad);
  });

  it("checkFormation 检查阵型正确时返回 False", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
      ["↖", [0, 0], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isFalse(result);
    assertSquadMember(squad, squadMembersDef);
  });

  it("checkFormation 检查阵型错误时返回 True", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
      ["↖", [2, 2], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isTrue(result);
    assertSquadMember(squad, squadMembersDef);
  });

  it("checkFormation  有 member 不在 relativePos 中时跳过", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
      ["MemberNotInRelativePos", [50, 50], []],
      ["↖", [2, 2], []],
      ["↗", [1, 0], []],
      ["↙", [0, 1], []],
      ["↘", [1, 1], []]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isTrue(result);
    assertSquadMember(squad, squadMembersDef);
  });

  it("regroup 都在正确位置时返回 True", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
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

  it("regroup 位置不对时返回 False", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
      ["↖", [0, 0], []],
      ["↗", [1, 1], [{ name: "moveTo", arguments: [1, 0, { reusePath: 1 }], result: undefined }]],
      ["↙", [2, 2], [{ name: "moveTo", arguments: [0, 1, { reusePath: 1 }], result: undefined }]],
      ["↘", [3, 3], [{ name: "moveTo", arguments: [1, 1, { reusePath: 1 }], result: undefined }]]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isFalse(result);
    assertSquadMember(squad, squadMembersDef);
  });

  it("regroup 有 member 不在 relativePos 中时跳过", () => {
    const squadMembersDef: (string | number[] | CalledRecord[])[][] = [
      ["MemberNotInRelativePos", [50, 50], []],
      ["↖", [0, 0], []],
      ["↗", [1, 1], [{ name: "moveTo", arguments: [1, 0, { reusePath: 1 }], result: undefined }]],
      ["↙", [2, 2], [{ name: "moveTo", arguments: [0, 1, { reusePath: 1 }], result: undefined }]],
      ["↘", [3, 3], [{ name: "moveTo", arguments: [1, 1, { reusePath: 1 }], result: undefined }]]
    ];
    const squad: SquadMember = {};
    initSquadMember(squad, squadMembersDef);

    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isFalse(result);
    assertSquadMember(squad, squadMembersDef);
  });
});

function initSquadMember(squad: SquadMember, squadMembersDef: (string | number[] | CalledRecord[])[][]): SquadMember {
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

function assertSquadMember(squad: SquadMember, squadMembersDef: (string | number[] | CalledRecord[])[][]): void {
  squadMembersDef.forEach(item =>
    assert.deepEqual(((squad[item[0] as string] as unknown) as CreepMock).calledRecords, item[2] as CalledRecord[])
  );
}
