/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { getMyCode } from "@test/moduleUtils";
import { getServer } from "../../serverUtils";

const { TerrainMatrix } = require("screeps-server-mockup");

export async function initBattleTestRoom(): Promise<void> {
  const roomName = "W1N1";
  const server = await getServer();
  const terrain = new TerrainMatrix();

  await server.world.addRoom(roomName);
  await server.world.setTerrain(roomName, terrain);

  await server.world.addRoom("W0N1");
  await server.world.setTerrain("W0N1", terrain);
  await server.world.addRoomObject("W0N1", "controller", 10, 10, { level: 1 });

  await server.world.addRoom("W0N2");
  await server.world.setTerrain("W0N2", terrain);
  await server.world.addRoomObject("W0N2", "controller", 10, 10, { level: 1 });

  const modules = await getMyCode();
  server.users[0] = await server.world.addBot({ username: "tester", room: "W0N1", x: 21, y: 26, modules });
  server.users[1] = await server.world.addBot({ username: "target", room: "W0N2", x: 21, y: 26, modules });
}
