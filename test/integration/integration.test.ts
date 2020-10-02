/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { assert } from "chai";
import { helper } from "./helper";
import { initRCL1 } from "./utils/initRCL1";
import { initRCL2 } from "./utils/initRCL2";
import { printDebugInfo } from "./utils/printDebugInfo";
const TICK_NUM = 100000;

describe("main", () => {
  it("测试服务器的 tick 是否匹配", async () => {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });

  it(`测试 RCL1 -> RCL2`, async () => {
    const RCL = 1;
    await initRCL1(helper, RCL);

    for (let i = 1; i < TICK_NUM; i += 1) {
      await helper.server.tick();
      const gameTime: number = await helper.server.world.gameTime;
      if ((gameTime - 1) % 20 === 0) {
        const memory: Memory = JSON.parse(await helper.player.memory);
        printDebugInfo(memory, gameTime);

        const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
        if (controllerLevel !== undefined && controllerLevel > RCL) {
          console.log(`RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick`);
          break;
        }
      }

      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
  });

  it(`测试 RCL2 -> RCL3`, async () => {
    const RCL = 2;
    await initRCL2(helper, RCL);

    for (let i = 1; i < TICK_NUM; i += 1) {
      await helper.server.tick();
      const gameTime: number = await helper.server.world.gameTime;
      if ((gameTime - 1) % 20 === 0) {
        const memory: Memory = JSON.parse(await helper.player.memory);
        printDebugInfo(memory, gameTime);

        const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
        if (controllerLevel !== undefined && controllerLevel > RCL) {
          console.log(`RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick`);
          break;
        }
      }

      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
  });
});
