/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
import { initWorld } from "./initWorld";

export async function initRCL1(helper: IntegrationTestHelper, RCL = 1): Promise<void> {
  await initWorld(helper, RCL);
}
