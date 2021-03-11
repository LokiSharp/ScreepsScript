import calcBodyPart from "@/utils/creep/calcBodyPart";

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
    expect(testBodyPartConstant).toBeDefined();
    expect(testBodyPartConstant.length).toEqual(16);
    [WORK, CARRY, MOVE, ATTACK, RANGED_ATTACK, TOUGH, HEAL, CLAIM].forEach(item =>
      expect(testBodyPartConstant).toContain(item)
    );
  });
});
