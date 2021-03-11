import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 10000;
const RCL = 1;

describe(`测试 RCL1 -> RCL2`, () => {
  it(`测试 RCL1 -> RCL2`, async () => {
    await runRCLTest(RCL, RCL + 1, TICK_NUM);
  }, 43200000);
});
