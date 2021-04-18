import * as _ from "lodash";
import { resetServer, stopServer } from "./integration/utils/serverUtils";
import { log } from "console";
import { refreshGlobalMock } from "./unit/mock";

global.console.log = log;
global._ = _;
// eslint-disable-next-line @typescript-eslint/no-var-requires
global._.assign(global, require("@screeps/common/lib/constants"));
// 当执行集成测试时
if (process.env.NODE_ENV === "mockup") {
  afterEach(resetServer);
  afterAll(stopServer);
}
// 默认为执行单元测试
else {
  beforeEach(refreshGlobalMock);
}
