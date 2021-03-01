import GameMock from "@mock/GameMock";
import { assert } from "chai";
import createRoomLink from "@/utils/console/createRoomLink";

describe("createRoomLink", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
  });

  it("可以生成房间链接", () => {
    assert.equal(
      createRoomLink("TestRoom"),
      '<a href="https://screeps.com/a/#!/room/TestShard/TestRoom" target="_self">TestRoom</a>'
    );
  });
});
