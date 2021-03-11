import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 200000;
const RCL = 6;

describe(`测试 RCL6 -> RCL7`, () => {
  it(`测试 RCL6 -> RCL7`, async () => {
    await runRCLTest(RCL, RCL + 1, TICK_NUM);
  }, 43200000);
});
