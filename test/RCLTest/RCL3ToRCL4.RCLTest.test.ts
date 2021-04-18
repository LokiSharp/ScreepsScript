import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 6 * 1000;
const TIME_OUT = 10 * 60 * 1000;
const RCL = 4;

describe(`测试 RCL3 -> RCL4`, () => {
  it(
    `测试 RCL3 -> RCL4`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
