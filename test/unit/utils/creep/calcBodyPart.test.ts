import { ATTACK, CARRY, CLAIM, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK } from "../../mock/CreepBodyPartMock";
import { assert } from "chai";
import calcBodyPart from "../../../../src/utils/creep/calcBodyPart";

describe("calcBodyPart", () => {
  it("可以展开 BodyPart", () => {
    const testBodySet: BodySet = {
      [WORK]: 2,
      [CARRY]: 2,
      [MOVE]: 2,
      [ATTACK]: 2,
      [RANGED_ATTACK]: 2,
      [TOUGH]: 2,
      [HEAL]: 2,
      [CLAIM]: 2
    };
    const testBodyPartConstant = calcBodyPart(testBodySet);
    assert.isDefined(testBodyPartConstant);
    assert.equal(testBodyPartConstant.length, 16);
    assert.includeMembers(testBodyPartConstant, [ATTACK, CARRY, CLAIM, HEAL, MOVE, RANGED_ATTACK, TOUGH, WORK]);
  });
});
