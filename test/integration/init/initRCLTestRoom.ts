/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { getMyCode } from "@test/moduleUtils";
import { getServer } from "@test/serverUtils";

const { TerrainMatrix } = require("screeps-server-mockup");

export async function initRCLTestRoom(RCL: number): Promise<void> {
  const roomName = "W1N1";
  const server = await getServer();
  const { db } = server.common.storage;
  const C = server.constants;
  const terrain = new TerrainMatrix();
  const walls = [
    [10, 10],
    [10, 40],
    [40, 10],
    [40, 40]
  ];
  _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

  await server.world.addRoom(roomName);
  await server.world.setTerrain(roomName, terrain);
  const controller = await server.world.addRoomObject(roomName, "controller", 10, 10, { level: 1 });
  await server.world.addRoomObject(roomName, "source", 10, 40, {
    energy: C.SOURCE_ENERGY_CAPACITY,
    energyCapacity: C.SOURCE_ENERGY_CAPACITY,
    ticksToRegeneration: 300
  });
  await server.world.addRoomObject(roomName, "source", 40, 10, {
    energy: C.SOURCE_ENERGY_CAPACITY,
    energyCapacity: C.SOURCE_ENERGY_CAPACITY,
    ticksToRegeneration: 300
  });
  await server.world.addRoomObject(roomName, "mineral", 40, 40, {
    mineralType: "X",
    density: 3,
    mineralAmount: C.MINERAL_DENSITY[3]
  });

  const modules = await getMyCode();
  server.users[0] = await server.world.addBot({ username: "tester", room: roomName, x: 21, y: 26, modules });

  const rclProgressPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 90, 7: 90 };
  await db["rooms.objects"].update(
    { _id: controller._id },
    { $set: { level: RCL, progress: (C.CONTROLLER_LEVELS[RCL] / 100) * rclProgressPercent[RCL] } }
  );
}
