import { ConstantsMock } from "../../mock/ConstantsMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import { assert } from "chai";
import stateScanner from "../../../../src/utils/global/stateScanner";

describe("stateScanner", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Memory = _.clone(new MemoryMock());
    ConstantsMock();
  });

  it("可以运行统计状态", () => {
    stateScanner();

    assert.deepEqual(Memory.stats, {
      gcl: NaN,
      gclLevel: 0,
      gpl: NaN,
      gplLevel: 0,
      cpu: 0,
      bucket: 0,
      credit: 0,
      rooms: {}
    });

    Game.gcl = { level: 8, progress: 50, progressTotal: 100 };
    Game.gpl = { level: 8, progress: 50, progressTotal: 100 };
    Game.cpu.bucket = 10000;
    Game.market.credits = 10000;

    stateScanner();

    assert.deepEqual(Memory.stats, {
      gcl: 50,
      gclLevel: 8,
      gpl: 50,
      gplLevel: 8,
      cpu: 0,
      bucket: 10000,
      credit: 10000,
      rooms: {}
    });
  });

  it("只在 time % 20 === 0 时触发统计", () => {
    stateScanner();

    assert.deepEqual(Memory.stats, {
      gcl: NaN,
      gclLevel: 0,
      gpl: NaN,
      gplLevel: 0,
      cpu: 0,
      bucket: 0,
      credit: 0,
      rooms: {}
    });

    for (let time = 0; time < 1000; time++) {
      Game.time = time;

      if (time % 20 === 0) {
        Game.gcl = { level: 8, progress: 50, progressTotal: 100 };
        Game.gpl = { level: 8, progress: 50, progressTotal: 100 };
        Game.cpu.bucket = 10000;
        Game.market.credits = 10000;
      } else {
        Game.gcl = { level: 0, progress: 0, progressTotal: 0 };
        Game.gpl = { level: 0, progress: 0, progressTotal: 0 };
        Game.cpu.bucket = 0;
        Game.market.credits = 0;
      }

      stateScanner();

      assert.deepEqual(Memory.stats, {
        gcl: 50,
        gclLevel: 8,
        gpl: 50,
        gplLevel: 8,
        cpu: 0,
        bucket: 10000,
        credit: 10000,
        rooms: {}
      });
    }
  });
});
