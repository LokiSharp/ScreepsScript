import CreepMock from "@mock/CreepMock";
import MemoryMock from "@mock/MemoryMock";
import OwnerMock from "@mock/OwnerMock";
import { assert } from "chai";
import { whiteListFilter } from "@/utils/global/whiteListFilter";

describe("whiteListFilter", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = new MemoryMock();
  });

  it("Memory.whiteList 不存在时直接返回 true", () => {
    const userInWhiteList = new OwnerMock("UserInWhiteList");
    const testCreep = new CreepMock("" as Id<CreepMock>, 0, 0);
    testCreep.owner = userInWhiteList;
    delete Memory.whiteList;
    const result = whiteListFilter((testCreep as unknown) as Creep);
    assert.isTrue(result);
  });

  it("Owner 在白名单中返回 false 并计数", () => {
    const userInWhiteList = new OwnerMock("UserInWhiteList");
    const testCreep = new CreepMock("" as Id<CreepMock>, 0, 0);
    testCreep.owner = userInWhiteList;
    Memory.whiteList.UserInWhiteList = 0;
    const result = whiteListFilter((testCreep as unknown) as Creep);
    assert.isFalse(result);
    assert.equal(Memory.whiteList.UserInWhiteList, 1);
    for (let i = 0; i < 100; i++) {
      whiteListFilter((testCreep as unknown) as Creep);
    }
    assert.equal(Memory.whiteList.UserInWhiteList, 101);
  });

  it("Owner 不在白名单中返回 true", () => {
    const userNotInWhiteList = new OwnerMock("userNotInWhiteList");
    const testCreep = new CreepMock("" as Id<CreepMock>, 0, 0);
    testCreep.owner = userNotInWhiteList;
    const result = whiteListFilter((testCreep as unknown) as Creep);
    assert.isTrue(result);
  });
});
