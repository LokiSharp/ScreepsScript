/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getServer } from "../../serverUtils";
import { initRCLTestRoom } from "../init/initRCLTestRoom";
import { printDebugInfo } from "./printDebugInfo";

export async function runRCLTest(RCL: number, _RCL: number, tickNum: number): Promise<void> {
  const roomName = "W1N1";
  await initRCLTestRoom(RCL);
  const server = await getServer();
  const user = server.users[0];
  for (let gameTime = 1; gameTime <= tickNum; gameTime += 1) {
    await server.tick();
    const memory: Memory = JSON.parse(await user.memory);
    if (gameTime % 100) continue;
    printDebugInfo(memory, gameTime);

    const controllerLevel = memory.stats.rooms[roomName].controllerLevel;
    if (controllerLevel && controllerLevel >= _RCL) {
      console.log(`RCL${RCL} -> RCL${_RCL} ${gameTime} tick`);
      break;
    }

    const { db } = server.common.storage;
    await db["rooms.objects"].update({ room: roomName, type: "constructionSite" }, { $set: { progress: 99999 } });
    await db["rooms.objects"].update({ room: roomName, type: "rampart" }, { $set: { hits: 3000000 } });

    _.each(await user.newNotifications, ({ message }) => console.log("[notification]", message));
  }
  expect((JSON.parse(await user.memory) as Memory).stats.rooms[roomName].controllerLevel).toEqual(_RCL);
}
