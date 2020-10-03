/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";

export async function initExtension(helper: IntegrationTestHelper, RCL: number): Promise<void> {
  const C = helper.server.constants;
  for (let i = 0; i < C.CONTROLLER_STRUCTURES.extension[RCL] / 5; i++) {
    for (let j = 0; j < 5; j++) {
      await helper.server.world.addRoomObject("W0N0", "extension", 15 + 2 * i, 20 + j, {
        user: helper.player.id,
        store: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
        storeCapacityResource: { energy: C.EXTENSION_ENERGY_CAPACITY[RCL] },
        hits: C.EXTENSION_HITS,
        hitsMax: C.EXTENSION_HITS
      });
    }
  }
}
