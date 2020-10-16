import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCLTestRoom(helper: IntegrationTestHelper, RCL: number): Promise<void> {
  await initWorld(helper, RCL);
}
