import FlagMock from "../../mock/FlagMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import { clearFlag } from "../../../../src/utils/global/clearFlag";

describe("clearFlag", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = new MemoryMock();
  });

  it("旗帜不存在时返回删除残余内存", () => {
    const flag = (new FlagMock("" as Id<FlagMock>, 0, 0) as unknown) as Flag;
    const testFlagIsDefined = [..."ABCD12345"].map(char => `testFlagIsDefined ${char}`);
    const testFlagIsUndefined = [..."ABCD12345"].map(char => `testFlagIsUndefined ${char}`);

    testFlagIsDefined.forEach(name => (Game.flags[name] = flag));
    testFlagIsDefined.forEach(name => (Memory.flags[name] = {} as FlagMemory));
    testFlagIsUndefined.forEach(name => (Memory.flags[name] = {} as FlagMemory));

    testFlagIsDefined.forEach(name => assert.isDefined(Memory.flags[name]));
    testFlagIsUndefined.forEach(name => assert.isDefined(Memory.flags[name]));
    clearFlag();
    testFlagIsDefined.forEach(name => assert.isDefined(Memory.flags[name]));
    testFlagIsUndefined.forEach(name => assert.isUndefined(Memory.flags[name]));
  });
});
