/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { helper } from "./helper";
import { initRCLTestRoom } from "./init/initRCLTestRoom";
import { printDebugInfo } from "./utils/printDebugInfo";
const TICK_NUM = 100000;
const RCL = 2;

describe("main", () => {
  it(`测试 RCL${RCL} -> RCL${RCL + 1}`, async () => {
    await initRCLTestRoom(helper, RCL);

    for (let gameTime = 1; gameTime < TICK_NUM; gameTime += 1) {
      await helper.server.tick();
      if (gameTime % 20) continue;
      const memory: Memory = JSON.parse(await helper.player.memory);
      printDebugInfo(memory, gameTime);

      const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
      if (controllerLevel !== undefined && controllerLevel > RCL) {
        console.log(`RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick`);
        break;
      }

      const { db } = helper.server.common.storage;
      await Promise.all([db["rooms.objects"].update({ type: "constructionSite" }, { $set: { progress: 99999 } })]);
      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
  });
});
