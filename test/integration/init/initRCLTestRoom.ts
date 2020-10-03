/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCLTestRoom(helper: IntegrationTestHelper, RCL: number): Promise<void> {
  await initWorld(helper, RCL);
  const C = helper.server.constants;
  if (RCL >= 2) {
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 28, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 26, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 24, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 30, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
  }

  if (RCL >= 3) {
    await helper.server.world.addRoomObject("W0N0", "extension", 25 + 5, 28, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25 + 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 26 + 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 24 + 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25 + 5, 30, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "constructionSite", 15, 20, {
      user: helper.player.id,
      progress: C.CONSTRUCTION_COST.storage - 1,
      progressTotal: C.CONSTRUCTION_COST.storage,
      structureType: "storage"
    });
  }

  if (RCL >= 4) {
    await helper.server.world.addRoomObject("W0N0", "extension", 25 - 5, 28, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25 - 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 26 - 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 24 - 5, 29, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25 - 5, 30, {
      user: helper.player.id,
      store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: C.EXTENSION_HITS,
      hitsMax: C.EXTENSION_HITS
    });
  }
}
