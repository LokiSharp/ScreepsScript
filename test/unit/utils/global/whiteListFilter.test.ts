import { getMockCreep } from "@mock/CreepMock";
import { refreshGlobalMock } from "@mock/index";
import { whiteListFilter } from "@/utils/global/whiteListFilter";

describe("whiteListFilter", () => {
  beforeEach(() => {
    refreshGlobalMock();
    Memory.whiteList = { UserInWhiteList: 0 };
  });

  it("Memory.whiteList 不存在时直接返回 true", () => {
    const testCreep = getMockCreep({ owner: { username: "UserInWhiteList" } });
    delete Memory.whiteList;
    const result = whiteListFilter((testCreep as unknown) as Creep);
    expect(result).toBeTruthy();
  });

  it("Owner 在白名单中返回 false 并计数", () => {
    const testCreep = getMockCreep({ owner: { username: "UserInWhiteList" } });
    Memory.whiteList.UserInWhiteList = 0;
    const result = whiteListFilter((testCreep as unknown) as Creep);
    expect(result).toBeFalsy();
    expect(Memory.whiteList.UserInWhiteList).toEqual(1);
    for (let i = 0; i < 100; i++) {
      whiteListFilter((testCreep as unknown) as Creep);
    }
    expect(Memory.whiteList.UserInWhiteList).toEqual(101);
  });

  it("Owner 不在白名单中返回 true", () => {
    const testCreep = getMockCreep({ owner: { username: "userNotInWhiteList" } });
    const result = whiteListFilter((testCreep as unknown) as Creep);
    expect(result).toBeTruthy();
  });
});
