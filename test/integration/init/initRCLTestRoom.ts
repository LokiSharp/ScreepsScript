/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IntegrationTestHelper } from "../helper";
import { initExtension } from "./initExtension";
import { initStorage } from "./initStorage";
import { initWorld } from "./initWorld";

export async function initRCLTestRoom(helper: IntegrationTestHelper, RCL: number): Promise<void> {
  await initWorld(helper, RCL);
  await initExtension(helper, RCL);
  await initStorage(helper, RCL);
}
