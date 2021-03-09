import { assert } from "chai";
import { checkAliveFlag } from "@/utils/global/checkAliveFlag";
import { getMockFlag } from "@mock/FlagMock";
import { getMockRoomPosition } from "@mock/RoomPositionMock";
import { refreshGlobalMock } from "@mock/index";

describe("checkAliveFlag", () => {
  beforeEach(() => {
    refreshGlobalMock();
    Memory.flags = {};
  });

  it("Memory.flags 不存在时直接返回 False", () => {
    delete Memory.flags;
    const result = checkAliveFlag("testFlagIsUndefined");
    assert.isFalse(result);
  });

  it("旗帜存在时返回 True", () => {
    Game.flags.testFlagIsDefined = getMockFlag({ pos: getMockRoomPosition({ x: 0, y: 0 }) });
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
