import { getMyCode } from "@test/integration/utils/moduleUtils";
import { getServer } from "@test/integration/utils/serverUtils";

// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const { TerrainMatrix } = require("screeps-server-mockup");

export async function initRCLTestRoom(): Promise<void> {
  const roomName = "W1N1";
  const server = await getServer();
  const C = server.constants;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const terrain = new TerrainMatrix() as TerrainMatrix;
  const walls = [
    [10, 10],
    [10, 40],
    [40, 10],
    [40, 40]
  ];
  _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

  await server.world.addRoom(roomName);
  await server.world.setTerrain(roomName, terrain);
  await server.world.addRoomObject(roomName, "controller", 10, 10, { level: 1 });
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
  //
  // const rclProgressPercent = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 90, 7: 90 };
  // await db["rooms.objects"].update(
  //   { _id: controller._id },
  //   { $set: { level: RCL, progress: (C.CONTROLLER_LEVELS[RCL] / 100) * rclProgressPercent[RCL] } }
  // );
}
