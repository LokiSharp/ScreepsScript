import { runRCLTest } from "../utils/runRCLTest";
const TICK_NUM = 70000;
const RCL = 5;

describe(`测试 RCL5 -> RCL6`, () => {
  it(`测试 RCL5 -> RCL6`, async () => {
    await runRCLTest(RCL, RCL + 1, TICK_NUM);
  });
});
