/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { EXTENSION_ENERGY_CAPACITY, EXTENSION_HITS } from "../mock";
import { IntegrationTestHelper } from "../helper";
const { readFileSync } = require("fs");
const { TerrainMatrix } = require("screeps-server-mockup");
const DIST_MAIN_JS = "dist/main.js";

export async function initRCL2(helper: IntegrationTestHelper, RCL = 2): Promise<void> {
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
  await helper.server.world.addRoomObject("W0N0", "mineral", 40, 40, {
    mineralType: "X",
    density: 3,
    mineralAmount: 3000
  });

  const modules = {
    main: readFileSync(DIST_MAIN_JS).toString()
  };
  helper.player = await helper.server.world.addBot({ username: "player", room: "W0N0", x: 25, y: 25, modules });
  await helper.server.world.addRoomObject("W0N0", "extension", 25, 28, {
    user: helper.player.id,
    store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    hits: EXTENSION_HITS,
    hitsMax: EXTENSION_HITS
  });
  await helper.server.world.addRoomObject("W0N0", "extension", 25, 29, {
    user: helper.player.id,
    store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    hits: EXTENSION_HITS,
    hitsMax: EXTENSION_HITS
  });
  await helper.server.world.addRoomObject("W0N0", "extension", 26, 29, {
    user: helper.player.id,
    store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    hits: EXTENSION_HITS,
    hitsMax: EXTENSION_HITS
  });
  await helper.server.world.addRoomObject("W0N0", "extension", 24, 29, {
    user: helper.player.id,
    store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    hits: EXTENSION_HITS,
    hitsMax: EXTENSION_HITS
  });
  await helper.server.world.addRoomObject("W0N0", "extension", 25, 30, {
    user: helper.player.id,
    store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
    hits: EXTENSION_HITS,
    hitsMax: EXTENSION_HITS
  });
}
