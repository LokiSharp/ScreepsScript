import { CPUMock } from "@mock/CPUMock";
import generatePixel from "@/utils/global/generatePixel";
import { refreshGlobalMock } from "@mock/index";

describe("generatePixel", () => {
  beforeEach(() => {
    refreshGlobalMock();
  });

  it("当 bucket 足够时生成 Pixel", () => {
    Game.cpu.bucket = 10000;
    generatePixel();
    expect(((Game.cpu as unknown) as CPUMock).calledRecords).toEqual([
      { name: "generatePixel", arguments: [], result: undefined }
    ]);
  });

  it("当 bucket 不足不生成 Pixel", () => {
    Game.cpu.bucket = 0;
    generatePixel();
    expect(((Game.cpu as unknown) as CPUMock).calledRecords).toEqual([]);
  });

  it("可以调整 bucket 限制值", () => {
    Game.cpu.bucket = 5000;
    generatePixel(Game.cpu.bucket + 1000);
    expect(((Game.cpu as unknown) as CPUMock).calledRecords).toEqual([]);
    generatePixel(Game.cpu.bucket - 1000);
    expect(((Game.cpu as unknown) as CPUMock).calledRecords).toEqual([
      { name: "generatePixel", arguments: [], result: undefined }
    ]);
  });
});
