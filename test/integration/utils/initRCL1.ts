/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
const { readFileSync } = require("fs");
const { TerrainMatrix } = require("screeps-server-mockup");
const DIST_MAIN_JS = "dist/main.js";
const DIST_MAIN_JS_MAP = "dist/main.js.map.js";

export async function initRCL1(helper: IntegrationTestHelper, RCL = 1): Promise<void> {
  const terrain = new TerrainMatrix();
  const walls = [
    [10, 10],
    [10, 40],
    [40, 10],
    [40, 40]
  ];
  _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

  await helper.server.world.addRoom("W0N0");
  await helper.server.world.setTerrain("W0N0", terrain);
  await helper.server.world.addRoomObject("W0N0", "controller", 10, 10, { level: RCL });
  await helper.server.world.addRoomObject("W0N0", "source", 10, 40, {
    energy: 1000,
    energyCapacity: 1000,
    ticksToRegeneration: 300
  });
  await helper.server.world.addRoomObject("W0N0", "source", 40, 10, {
    energy: 1000,
    energyCapacity: 1000,
    ticksToRegeneration: 300
  });
  await helper.server.world.addRoomObject("W0N0", "mineral", 40, 40, {
    mineralType: "X",
    density: 3,
    mineralAmount: 3000
  });

  const modules = {
    main: readFileSync(DIST_MAIN_JS).toString(),
    "main.js.map": readFileSync(DIST_MAIN_JS_MAP).toString()
  };
  helper.player = await helper.server.world.addBot({ username: "player", room: "W0N0", x: 15, y: 15, modules });
}
