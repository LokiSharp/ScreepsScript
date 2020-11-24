import { ConstantsMock } from "../../mock/ConstantsMock";
import CreepMock from "../../mock/CreepMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import doing from "../../../../src/utils/global/doing";

describe("doing", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Memory = _.clone(new MemoryMock());
    ConstantsMock();
  });

  it("可以运行 Creep", () => {
    const testCreep = new CreepMock("" as Id<CreepMock>, 0, 0);
    doing({ testCreep });
    assert.deepEqual(testCreep.called, [{ work: [] }]);
  });
});
