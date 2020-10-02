/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
const { ScreepsServer, stdHooks } = require("screeps-server-mockup");

/*
 * Helper class for creating a ScreepsServer and resetting it between tests.
 * See https://github.com/Hiryus/screeps-server-mockup for instructions on
 * manipulating the terrain and game state.
 */
export class IntegrationTestHelper {
  private _server: any;

  get server() {
    return this._server;
  }

  private _player: any;

  get player() {
    return this._player;
  }

  set player(player) {
    this._player = player;
  }

  async beforeEach() {
    this._server = new ScreepsServer();

    await this._server.world.reset();

    // Start server
    await this._server.start();
  }

  async afterEach() {
    await this._server.stop();
  }
}

beforeEach(async () => {
  await helper.beforeEach();
});

afterEach(async () => {
  await helper.afterEach();
});

before(() => {
  stdHooks.hookWrite();
});

export const helper = new IntegrationTestHelper();
