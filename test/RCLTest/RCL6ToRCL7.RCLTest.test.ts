import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 200 * 1000;
const TIME_OUT = 6 * 60 * 60 * 1000;
const RCL = 7;

describe(`测试 RCL6 -> RCL7`, () => {
  it(
    `测试 RCL6 -> RCL7`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
