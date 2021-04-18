import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 60 * 1000;
const TIME_OUT = 2 * 60 * 60 * 1000;
const RCL = 6;

describe(`测试 RCL5 -> RCL6`, () => {
  it(
    `测试 RCL5 -> RCL6`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
