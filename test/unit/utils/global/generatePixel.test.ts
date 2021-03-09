import { CPUMock } from "@mock/CPUMock";
import { assert } from "chai";
import generatePixel from "@/utils/global/generatePixel";
import { refreshGlobalMock } from "@mock/index";

describe("generatePixel", () => {
  beforeEach(() => {
    refreshGlobalMock();
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
