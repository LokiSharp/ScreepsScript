import { runRCLTest } from "./utils/runRCLTest";
const TICK_NUM = 100000;
const RCL = 6;

describe("main", () => {
  it(`测试 RCL${RCL} -> RCL${RCL + 1}`, async () => {
    await runRCLTest(RCL, TICK_NUM);
  });
});
