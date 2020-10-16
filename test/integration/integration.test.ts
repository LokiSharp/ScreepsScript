/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "./helper";
import { runRCLTest } from "./utils/runRCLTest";

describe("main", () => {
  it("测试服务器的 tick 是否匹配", async () => {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });

  it(`测试 RCL1 -> RCL8`, async () => {
    await runRCLTest(1, 8, 1000000);
  });
});
