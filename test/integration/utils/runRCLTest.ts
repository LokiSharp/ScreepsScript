/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { helper } from "../helper";
import { initRCLTestRoom } from "../init/initRCLTestRoom";
import { printDebugInfo } from "./printDebugInfo";

export async function runRCLTest(RCL: number, _RCL: number, tickNum: number): Promise<void> {
  await initRCLTestRoom(helper, RCL);

  for (let gameTime = 1; gameTime < tickNum; gameTime += 1) {
    await helper.server.tick();
    if (gameTime % 20) continue;
    const memory: Memory = JSON.parse(await helper.user.memory);
    printDebugInfo(memory, gameTime);

    const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
    if (controllerLevel !== undefined && controllerLevel >= _RCL) {
      console.log(`RCL${RCL} -> RCL${_RCL} ${gameTime} tick`);
      break;
    }

    const { db } = helper.server.common.storage;
    await db["rooms.objects"].update({ room: "W0N0", type: "constructionSite" }, { $set: { progress: 99999 } });
    await db["rooms.objects"].update({ room: "W0N0", type: "rampart" }, { $set: { hits: 3000000 } });
    await db["rooms.objects"].update({ room: "W0N0", type: "storage" }, { $set: { store: { energy: 950000 } } });

    _.each(await helper.user.newNotifications, ({ message }) => console.log("[notification]", message));
  }
}
