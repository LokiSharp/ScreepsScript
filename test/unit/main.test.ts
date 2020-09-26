import { Game, Memory } from "./mock";
import { assert } from "chai";
import { loop } from "../../src/main";

describe("main", () => {
  before(() => {
    // runs before all test in this block
  });

  beforeEach(() => {
    // runs before each test in this block
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(Game);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(Memory);
  });

  it("会导出 loop 函数", () => {
    assert.isTrue(typeof loop === "function");
  });

  it("会在没有上下文时返回空", () => {
    assert.isUndefined(loop());
  });
});
