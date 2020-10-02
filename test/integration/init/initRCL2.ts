/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { EXTENSION_ENERGY_CAPACITY, EXTENSION_HITS } from "../mock";
import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCL2(helper: IntegrationTestHelper, RCL = 2): Promise<void> {
  await initWorld(helper, RCL);

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
