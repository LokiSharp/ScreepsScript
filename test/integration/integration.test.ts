/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "./helper";

describe("main", () => {
  it("测试服务器的 tick 是否匹配", async () => {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });
});
