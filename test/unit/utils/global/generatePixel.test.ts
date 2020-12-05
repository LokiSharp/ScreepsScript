import CPUMock from "../../mock/CPUMock";
import GameMock from "../../mock/GameMock";
import { assert } from "chai";
import generatePixel from "../../../../src/utils/global/generatePixel";

describe("generatePixel", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
  });

  it("当 bucket 足够时生成 Pixel", () => {
    Game.cpu.bucket = 10000;
    generatePixel();
    assert.deepEqual(((Game.cpu as unknown) as CPUMock).calledRecords, [
      { name: "generatePixel", arguments: [], result: undefined }
    ]);
  });

  it("当 bucket 不足不生成 Pixel", () => {
    Game.cpu.bucket = 0;
    generatePixel();
    assert.deepEqual(((Game.cpu as unknown) as CPUMock).calledRecords, []);
  });

  it("可以调整 bucket 限制值", () => {
    Game.cpu.bucket = 5000;
    generatePixel(Game.cpu.bucket + 1000);
    assert.deepEqual(((Game.cpu as unknown) as CPUMock).calledRecords, []);
    generatePixel(Game.cpu.bucket - 1000);
    assert.deepEqual(((Game.cpu as unknown) as CPUMock).calledRecords, [
      { name: "generatePixel", arguments: [], result: undefined }
    ]);
  });
});
