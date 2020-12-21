import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import { transportActions } from "../../../../src/modules/RoomTransportTask/transportActions";

describe("transportActions", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = new MemoryMock();
  });
  it("可以初始化", () => {
    Memory.rooms.W0N0 = {} as RoomMemory;
    assert.isDefined(transportActions);
  });
});
