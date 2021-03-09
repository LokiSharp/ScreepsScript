import { assert } from "chai";
import { clearFlag } from "@/utils/global/clearFlag";
import { getMockFlag } from "@mock/FlagMock";
import { getMockRoomPosition } from "@mock/RoomPositionMock";
import { refreshGlobalMock } from "@mock/index";

describe("clearFlag", () => {
  beforeEach(() => {
    refreshGlobalMock();
    Memory.flags = {};
  });

  it("旗帜不存在时返回删除残余内存", () => {
    const flag = getMockFlag({ pos: getMockRoomPosition({ x: 0, y: 0 }) });
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
