import { runRCLTest } from "../utils/runRCLTest";
const TICK_NUM = 100000;
const RCL = 4;

describe(`测试 RCL4 -> RCL5`, () => {
  it(`测试 RCL4 -> RCL5`, async () => {
    await runRCLTest(RCL, RCL + 1, TICK_NUM);
  });
});
