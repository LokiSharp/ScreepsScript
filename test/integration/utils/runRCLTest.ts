import { getServer } from "./serverUtils";
import { initRCLTestRoom } from "../init/initRCLTestRoom";

export async function runRCLTest(RCL: number, tickNum: number): Promise<void> {
  const roomName = "W1N1";
  await initRCLTestRoom();
  const server = await getServer();
  const { db } = server.common.storage;
  const C = server.constants;
  const user = server.users[0];
  for (let gameTime = 1; gameTime <= tickNum; gameTime += 1) {
    await server.tick();
    const memory: Memory = JSON.parse(await user.memory) as Memory;
    if (gameTime % 100) continue;

    const controllerLevel = memory.stats.rooms[roomName].controllerLevel;
    const controllerRatio = memory.stats.rooms[roomName].controllerRatio;
    if (controllerLevel) {
      if (controllerLevel >= RCL) {
        console.log(`-> RCL${RCL} ${gameTime} tick`);
        break;
      } else {
        const rclProgressPercent = 99;
        if (controllerRatio < rclProgressPercent) {
          console.log(`-> RCL${controllerLevel}`);
          await db["rooms.objects"].update(
            { room: roomName, type: "controller" },
            {
              $set: {
                progress: (C.CONTROLLER_LEVELS[controllerLevel] / 100) * rclProgressPercent
              }
            }
          );
        }
      }
    }

    await db["rooms.objects"].update({ room: roomName, type: "constructionSite" }, { $set: { progress: 99999 } });
    await db["rooms.objects"].update({ room: roomName, type: "rampart" }, { $set: { hits: 3000000 } });

    _.each(await user.newNotifications, ({ message }) => console.log("[notification]", message));
  }
  expect((JSON.parse(await user.memory) as Memory).stats.rooms[roomName].controllerLevel).toEqual(RCL);
}
