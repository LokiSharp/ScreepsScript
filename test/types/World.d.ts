declare interface UserBadge {
  type: number;
  color1: string;
  color2: string;
  color3: string;
  flip: boolean;
  param: number;
}
declare interface AddBotOptions {
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
declare interface SerializedRoomObject {
  serial: string;
  objects: {
    type: string;
    x: number;
    y: number;
    attributes: Record<string, Record<string, string | number | boolean>>;
  }[];
}
declare class World {
  private server;
  public constructor(server: ScreepsServer);
  public get gameTime(): Promise<number>;
  /**
   * 连接到服务器并返回 constants, database, env 和 pubsub 对象
   */
  public load(): Promise<{
    C: CommonConstants;
    db: CommonStorageDBCollection;
    env: CommonStorageEnv;
    pubsub: CommonStoragePubsub;
  }>;
  /**
   * 设置房间状态，如果没有就创建
   * @param room 房间名
   * @param status 房间状态
   * @param active 是否激活
   */
  public setRoom(room: string, status?: string, active?: boolean): Promise<void>;
  /**
   * setRoom() 的别名
   * @param room 房间名
   */
  public addRoom(room: string): Promise<void>;
  /**
   * 获取房间的地形数据
   * @param room 房间名
   */
  public getTerrain(room: string): Promise<TerrainMatrix>;
  /**
   * 设置房间的地形数据
   * @param room 房间名
   * @param terrain 地形矩阵
   */
  public setTerrain(room: string, terrain?: TerrainMatrix): Promise<void>;
  /**
   * 添加房间对象
   * @param room 房间对象所在房间名
   * @param type 房间对象类型
   * @param x 房间对象 x 座标
   * @param y 房间对象 x 座标
   * @param attributes 房间对象的其他属性
   */
  public addRoomObject(
    room: string,
    type: string,
    x: number,
    y: number,
    attributes?: Record<string, unknown>
  ): Promise<DBRoomObject>;
  /**
   * 重置世界数据
   */
  public reset(): Promise<ScreepsServer>;
  /**
   * 创建一个拥有 sources, minerals 和 controllers 的 9 个房间的基础世界
   */
  public stubWorld(): Promise<void>;
  /**
   * 获取房间的所有房间对象
   * @param room 在房间名
   */
  public roomObjects(room: string): Promise<DBRoomObject[]>;
  /**
   * 为用户生成一个随机头像
   */
  public genRandomBadge(): UserBadge;
  /**
   * 添加一个新用户到世界
   * @param username 用户名
   * @param room 房间
   * @param x Spawn x 座标
   * @param y Spawn y 座标
   * @param gcl 初始 GCL
   * @param cpu 初始 CPU
   * @param cpuAvailable 可用 CPU
   * @param active 是否激活
   * @param spawnName Spawn 名
   * @param modules 代码模块
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
  }: AddBotOptions): Promise<User>;
  private updateEnvTerrain;
}
