import { Server, StdHooks, User } from "screeps-test-server";

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
    this.serverCache = new Server();
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
});

afterEach(() => {
  helper.afterEach();
});

before(() => {
  StdHooks.hookWrite();
});
