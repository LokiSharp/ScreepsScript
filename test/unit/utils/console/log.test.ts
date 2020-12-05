import GameMock from "../../mock/GameMock";
import log from "../../../../src/utils/console/log";

describe("log", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
  });

  it("可以打印日志", () => {
    log("TestLogContent", [], "red", true);
    log("TestLogContent");
  });
});
