/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";

export async function initStorage(helper: IntegrationTestHelper, RCL: number): Promise<void> {
  const C = helper.server.constants;
  for (let i = 0; i < C.CONTROLLER_STRUCTURES.storage[RCL]; i++) {
    await helper.server.world.addRoomObject("W0N0", "constructionSite", 12, 20, {
      user: helper.player.id,
      progress: C.CONSTRUCTION_COST.storage - 1,
      progressTotal: C.CONSTRUCTION_COST.storage,
      structureType: "storage"
    });
  }
}
