import sendCommandToConsole from "@/utils/console/sendCommandToConsole";

describe("sendCommandToConsole", () => {
  it("可以发送命令到终端", () => {
    expect(sendCommandToConsole("TestCommand")).toEqual(
      "angular.element(document.body).injector().get('Console').sendCommand('(TestCommand)()', 1)"
    );
  });
});
