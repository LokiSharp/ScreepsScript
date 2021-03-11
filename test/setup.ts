import { refreshGlobalMock } from "./unit/mock";
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
global._ = require("lodash");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore : allow adding lodash to global
global._.assign(global, require("@screeps/common/lib/constants"));

beforeEach(refreshGlobalMock);
