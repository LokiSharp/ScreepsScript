import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 2 * 1000;
const TIME_OUT = 5 * 60 * 1000;
const RCL = 3;

describe(`测试 RCL2 -> RCL3`, () => {
  it(
    `测试 RCL2 -> RCL3`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
