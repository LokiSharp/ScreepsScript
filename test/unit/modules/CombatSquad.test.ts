import { CombatSquad } from "../../../src/modules/CombatSquad/CombatSquad";
import { ConstantsMock } from "../mock/ConstantsMock";
import CreepMock from "../mock/CreepMock";
import { assert } from "chai";

describe("checkFormation", () => {
  it("检查阵型正确时返回 False", () => {
    const squad: SquadMember = {
      "↖": (new CreepMock("" as Id<CreepMock>, 0, 0) as unknown) as Creep,
      "↗": (new CreepMock("" as Id<CreepMock>, 1, 0) as unknown) as Creep,
      "↙": (new CreepMock("" as Id<CreepMock>, 0, 1) as unknown) as Creep,
      "↘": (new CreepMock("" as Id<CreepMock>, 1, 1) as unknown) as Creep
    };
    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isFalse(result);
  });

  it("检查阵型错误时返回 True", () => {
    const squad: SquadMember = {
      "↖": (new CreepMock("" as Id<CreepMock>, 2, 2) as unknown) as Creep,
      "↗": (new CreepMock("" as Id<CreepMock>, 1, 0) as unknown) as Creep,
      "↙": (new CreepMock("" as Id<CreepMock>, 0, 1) as unknown) as Creep,
      "↘": (new CreepMock("" as Id<CreepMock>, 1, 1) as unknown) as Creep
    };
    const result = CombatSquad.checkFormation((squad as unknown) as SquadMember);

    assert.isTrue(result);
  });
});

describe("regroup", () => {
  beforeEach(() => {
    ConstantsMock();
  });
  it("都在正确位置时返回 True", () => {
    const squad: SquadMember = {
      "↖": (new CreepMock("" as Id<CreepMock>, 0, 0) as unknown) as Creep,
      "↗": (new CreepMock("" as Id<CreepMock>, 1, 0) as unknown) as Creep,
      "↙": (new CreepMock("" as Id<CreepMock>, 0, 1) as unknown) as Creep,
      "↘": (new CreepMock("" as Id<CreepMock>, 1, 1) as unknown) as Creep
    };
    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isTrue(result);
    assert.deepEqual(((squad["↖"] as unknown) as CreepMock).called, []);
    assert.deepEqual(((squad["↗"] as unknown) as CreepMock).called, []);
    assert.deepEqual(((squad["↙"] as unknown) as CreepMock).called, []);
    assert.deepEqual(((squad["↘"] as unknown) as CreepMock).called, []);
  });

  it("位置不对时返回 False", () => {
    const squad: SquadMember = {
      "↖": (new CreepMock("" as Id<CreepMock>, 0, 0) as unknown) as Creep,
      "↗": (new CreepMock("" as Id<CreepMock>, 1, 1) as unknown) as Creep,
      "↙": (new CreepMock("" as Id<CreepMock>, 2, 2) as unknown) as Creep,
      "↘": (new CreepMock("" as Id<CreepMock>, 3, 3) as unknown) as Creep
    };
    const result = CombatSquad.regroup((squad as unknown) as SquadMember);

    assert.isFalse(result);
    assert.deepEqual(((squad["↖"] as unknown) as CreepMock).called, []);
    assert.deepEqual(((squad["↗"] as unknown) as CreepMock).called, [{ moveTo: [1, 0, { reusePath: 1 }] }]);
    assert.deepEqual(((squad["↙"] as unknown) as CreepMock).called, [{ moveTo: [0, 1, { reusePath: 1 }] }]);
    assert.deepEqual(((squad["↘"] as unknown) as CreepMock).called, [{ moveTo: [1, 1, { reusePath: 1 }] }]);
  });
});
