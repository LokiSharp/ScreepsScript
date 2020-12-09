/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
// inject mocha globally to allow custom interface refer without direct import - bypass bundle issue
global._ = require("lodash");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore : allow adding lodash to global
global.mocha = require("mocha");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore : allow adding mocha to global
global.chai = require("chai");
global.sinon = require("sinon");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore : allow adding sinon-chai to global
global.chai.use(require("sinon-chai"));
global._.assign(global, require("@screeps/common/lib/constants"));
