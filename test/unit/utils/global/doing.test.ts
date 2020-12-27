import BaseMock from "../../mock/BaseMock";
import CreepMock from "../../mock/CreepMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import doing from "../../../../src/utils/global/doing";

describe("doing", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = new MemoryMock();
  });

  it("可以运行 Creep", () => {
    const testCreep = new CreepMock("" as Id<CreepMock>, 0, 0);
    doing({ testCreep });
    assert.deepEqual(testCreep.calledRecords, [{ name: "work", arguments: [], result: undefined }]);
  });

  it("对象没有 work 时不运行", () => {
    const testObject = new BaseMock();
    doing({ testObject });
    assert.deepEqual(testObject.calledRecords, []);
  });
});
