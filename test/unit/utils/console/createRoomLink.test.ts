import { assert } from "chai";
import createRoomLink from "../../../../src/utils/console/createRoomLink";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";

describe("createRoomLink", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
  });

  it("可以生成房间链接", () => {
    assert.equal(
      createRoomLink("TestRoom"),
      '<a href="https://screeps.com/a/#!/room/TestShard/TestRoom" target="_self">TestRoom</a>'
    );
  });
});
