import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 1000;
const TIME_OUT = 60 * 1000;
const RCL = 2;

describe(`测试 RCL1 -> RCL2`, () => {
  it(
    `测试 RCL1 -> RCL2`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
