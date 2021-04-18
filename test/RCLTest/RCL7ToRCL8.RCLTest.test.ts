import { runRCLTest } from "../integration/utils/runRCLTest";
const TICK_NUM = 300 * 1000;
const TIME_OUT = 6 * 60 * 60 * 1000;
const RCL = 8;

describe(`测试 RCL7 -> RCL8`, () => {
  it(
    `测试 RCL7 -> RCL8`,
    async () => {
      await runRCLTest(RCL, TICK_NUM);
    },
    TIME_OUT
  );
});
