import { ConstantsMock } from "../../mock/ConstantsMock";
import FlagMock from "../../mock/FlagMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import { checkAliveFlag } from "../../../../src/utils/global/checkAliveFlag";

describe("checkAliveFlag", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Memory = _.clone(new MemoryMock());
    ConstantsMock();
  });

  it("旗帜存在时返回 True", () => {
    Game.flags.testFlagIsDefined = (new FlagMock("" as Id<FlagMock>, 0, 0) as unknown) as Flag;
    const result = checkAliveFlag("testFlagIsDefined");
    assert.isTrue(result);
  });

  it("旗帜不存在时返回 False 并删除残余内存", () => {
    Memory.flags.testFlagIsUndefined = {} as FlagMemory;
    assert.isDefined(Memory.flags.testFlagIsUndefined);
    const result = checkAliveFlag("testFlagIsUndefined");
    assert.isFalse(result);
    assert.isUndefined(Memory.flags.testFlagIsUndefined);
  });
});
