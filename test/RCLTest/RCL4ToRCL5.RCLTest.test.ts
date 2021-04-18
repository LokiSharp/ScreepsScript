import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 25 * 1000;
const TIME_OUT = 30 * 60 * 1000;
const RCL = 5;

describe(`测试 RCL4 -> RCL5`, () => {
  it(
    `测试 RCL4 -> RCL5`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
