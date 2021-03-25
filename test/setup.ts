import { resetServer, stopServer } from "./serverUtils";
import { log } from "console";
import { refreshGlobalMock } from "./unit/mock";
global.console.log = log;

// 当执行集成测试时
if (process.env.NODE_ENV === "mockup") {
  jest.setTimeout(60 * 1000);
  beforeAll(resetServer);
  afterAll(stopServer);
  afterEach(resetServer);
}
// 默认为执行单元测试
else {
  beforeEach(refreshGlobalMock);
}
