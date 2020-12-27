import { runRCLTest } from "../utils/runRCLTest";
const TICK_NUM = 80000;
const RCL = 3;

describe(`测试 RCL3 -> RCL4`, () => {
  it(`测试 RCL3 -> RCL4`, async () => {
    await runRCLTest(RCL, RCL + 1, TICK_NUM);
  });
});
