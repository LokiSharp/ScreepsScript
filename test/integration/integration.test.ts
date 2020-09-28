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

  it("测试是否能读写内存", async function () {
    await helper.player.console(`Memory.foo = 'bar'`);
    await helper.server.tick();
    const memory = JSON.parse(await helper.player.memory);
    assert.equal(memory.foo, "bar");
  });

  it("运行代码 1000 tick", async () => {
    for (let i = 1; i < 1000; i += 1) {
      console.log("[tick]", await helper.server.world.gameTime);
      await helper.server.tick();
      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
      console.log("[memory]", await helper.player.memory, "\n");
    }
  });
});
