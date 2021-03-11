import createRoomLink from "@/utils/console/createRoomLink";
import { refreshGlobalMock } from "@mock/index";

describe("createRoomLink", () => {
  beforeEach(() => {
    refreshGlobalMock();
  });

  it("可以生成房间链接", () => {
    expect(createRoomLink("TestRoom")).toEqual(
      '<a href="https://screeps.com/a/#!/room/TestShard/TestRoom" target="_self">TestRoom</a>'
    );
  });
});
