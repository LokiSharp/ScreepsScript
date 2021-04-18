import { getMockGame } from "@mock/GameMock";
import log from "@/utils/console/log";

const consoleLogMock = jest.spyOn(console, "log").mockImplementation(() => true);

describe("log", () => {
  beforeEach(() => {
    global.Game = getMockGame();
  });

  it("可以打印日志", () => {
    log("TestLogContent", [], "red", true);
    expect(consoleLogMock).toHaveBeenCalledWith(
      '<text style="color: #ef9a9a; font-weight: bolder;"></text>TestLogContent'
    );
    log("TestLogContent");
    expect(consoleLogMock).toHaveBeenCalledWith('<text style=" font-weight: bolder;"></text>TestLogContent');
  });

  it("可以打印日志并添加前缀", () => {
    log("TestLogContent", ["TestLogPrefix"], "red", true);
    expect(consoleLogMock).toHaveBeenCalledWith(
      '<text style="color: #ef9a9a; font-weight: bolder;">【TestLogPrefix】 </text>TestLogContent'
    );
  });
});
