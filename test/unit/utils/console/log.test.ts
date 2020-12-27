import GameMock from "../../mock/GameMock";
import { assert } from "chai";
import log from "../../../../src/utils/console/log";

// eslint-disable-next-line @typescript-eslint/unbound-method
const stdout = process.stdout.write;

let out: string;

function hookWrite(): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.stdout.write = function (message: string): boolean {
    out = message;
  };
}

function resetWrite(): void {
  process.stdout.write = stdout;
}

describe("log", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
    out = undefined;
  });

  it("可以打印日志", () => {
    hookWrite();
    log("TestLogContent", [], "red", true);
    assert.equal(out, '<text style="color: #ef9a9a; font-weight: bolder;"></text>TestLogContent\n');
    log("TestLogContent");
    assert.equal(out, '<text style=" font-weight: bolder;"></text>TestLogContent\n');
    resetWrite();
  });

  it("可以打印日志并添加前缀", () => {
    hookWrite();
    log("TestLogContent", ["TestLogPrefix"], "red", true);
    assert.equal(out, '<text style="color: #ef9a9a; font-weight: bolder;">【TestLogPrefix】 </text>TestLogContent\n');
    resetWrite();
  });
});
