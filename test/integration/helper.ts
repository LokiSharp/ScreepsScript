// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { ScreepsServer, stdHooks } = require("screeps-server-mockup");

export class IntegrationTestHelper {
  private serverCache: Server;
  private userCache: User;
  private targetCache: User;

  public get server(): Server {
    return this.serverCache;
  }

  public get user(): User {
    return this.userCache;
  }

  public set user(user: User) {
    this.userCache = user;
  }

  public get target(): User {
    return this.targetCache;
  }

  public set target(user: User) {
    this.targetCache = user;
  }

  public async beforeEach(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.serverCache = new ScreepsServer() as Server;
    await this.serverCache.world.reset();

    // Start server
    await this.serverCache.start();
  }

  public afterEach(): void {
    this.serverCache.stop();
  }
}

export const helper = new IntegrationTestHelper();

beforeEach(async () => {
  await helper.beforeEach();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  stdHooks.hookWrite();
});

afterEach(() => {
  helper.afterEach();
});
