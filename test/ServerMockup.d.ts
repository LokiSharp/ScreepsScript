/* eslint-disable max-classes-per-file */
interface MockServerOptions {
  path: string;
  logdir: string;
  port: number;
  modfile?: string;
}

declare interface StdHooks {
  hookWrite(): void;
  hookWrite(): void;
  resetWrite(): void;
  resetWrite(): void;
}

declare interface MockedServerConstructor {
  new (opts?: Partial<MockServerOptions>): MockedServer;
}

declare class MockedServer {
  public driver: any;
  public config: any;
  public common: any;
  public constants: any;
  public connected: boolean;
  public world: MockedWorld;
  public constructor(opts?: Partial<MockServerOptions>);
  public setOpts(opts: MockServerOptions): this;
  public getOpts(): MockServerOptions;
  public connect(): Promise<this>;
  public tick(): Promise<this>;
  public start(): Promise<this>;
  public stop(): Promise<this>;
}

declare class MockedWorld {
  /**
     Getters
     */
  public get gameTime(): Promise<number>;
  /**
     Connect to server (if needed) and return constants, database, env and pubsub objects
     */
  public load(): Promise<{
    C: any;
    db: any;
    env: any;
    pubsub: any;
  }>;
  /**
     Set room status (and create it if needed)
     This function does NOT generate terrain data
     */
  public setRoom(room: string, status?: string, active?: boolean): Promise<void>;
  /**
     Simplified alias for setRoom()
     */
  public addRoom(room: string): Promise<void>;
  /**
     Return room terrain data (walls, plains and swamps)
     Return a TerrainMatrix instance
     */
  public getTerrain(room: string): Promise<MockedTerrainMatrix>;
  /**
     Define room terrain data (walls, plains and swamps)
     @terrain must be an instance of TerrainMatrix.
     */
  public setTerrain(room: string, terrain?: MockedTerrainMatrix): Promise<void>;
  /**
     Add a RoomObject to the specified room
     Returns db operation result
     */
  public addRoomObject(
    room: string,
    type: string,
    x: number,
    y: number,
    attributes?: Record<string, unknown>
  ): Promise<any>;
  /**
     Reset world data to a barren world with no rooms, but with invaders and source keepers users
     */
  public reset(): Promise<void>;
  /**
     Stub a basic world by adding 9 plausible rooms with sources, minerals and controllers
     */
  public stubWorld(): Promise<void>;
  /**
     Get the roomObjects list for requested roomName
     */
  public roomObjects(roomName: string): Promise<any[]>;
  /**
     Add a new user to the world
     */
  public addBot({
    username,
    room,
    x,
    y,
    gcl,
    cpu,
    cpuAvailable,
    active,
    spawnName,
    modules
  }: AddBotOptions): Promise<MockedUser>;
  public updateEnvTerrain;
}

interface AddBotOptions {
  username: string;
  room: string;
  x: number;
  y: number;
  gcl?: number;
  cpu?: number;
  cpuAvailable?: number;
  active?: number;
  spawnName?: string;
  modules?: Record<string, unknown>;
}

type MockedTerrainType = "plain" | "wall" | "swamp";

declare class MockedTerrainMatrix {
  private data;
  /**
     Constructor
     */
  public constructor();
  /**
     Getters
     */
  public get(x: number, y: number): MockedTerrainType;
  /**
     Setters
     */
  public set(x: number, y: number, value: MockedTerrainType): this;
  /**
     Serialize the terrain for database storage
     */
  public serialize(): string;
  /**
     Return a string representation of the matrix
     */
  public unserialize(str: string): MockedTerrainMatrix;
}

interface MockedUserNotification {
  message: string;
  type: string;
  date: number;
  count: number;
  _id: string;
}

declare class MockedUser {
  /**
     Constructor
     */
  public constructor(
    server: MockedServer,
    data: {
      _id: string;
      username: string;
    }
  );
  /**
     Getters
     */
  public get id(): string;
  public get username(): string;
  public get cpu(): Promise<number>;
  public get cpuAvailable(): Promise<number>;
  public get gcl(): Promise<number>;
  public get rooms(): Promise<any>;
  public get lastUsedCpu(): Promise<number>;
  public get memory(): Promise<string>;
  public get notifications(): Promise<MockedUserNotification[]>;
  public get newNotifications(): Promise<MockedUserNotification[]>;
  public get activeSegments(): Promise<number[]>;
  /**
     Return the content of user segments based on @list (the list of segments, ie: [0, 1, 2]).
     */
  public getSegments(list: number[]): Promise<any[]>;
  /**
     Set a new console command to run next tick
     */
  public console(cmd: string): Promise<any>;
  /**
     Return the current value of the requested user data
     */
  public getData(name: string): Promise<any>;
  /**
     Initialise console events
     */
  public init(): Promise<this>;
}
