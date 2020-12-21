declare interface UserNotification {
  message: string;
  type: string;
  date: number;
  count: number;
  _id: string;
}
declare class User {
  private knownNotifications;
  private _id;
  private _username;
  private _server;
  public constructor(
    server: Server,
    data: {
      _id: string;
      username: string;
    }
  );
  public get id(): string;
  public get username(): string;
  public get cpu(): Promise<number>;
  public get cpuAvailable(): Promise<number>;
  public get gcl(): Promise<number>;
  public get rooms(): Promise<string>;
  public get lastUsedCpu(): Promise<number>;
  public get memory(): Promise<string>;
  public get notifications(): Promise<UserNotification[]>;
  public get newNotifications(): Promise<UserNotification[]>;
  public get activeSegments(): Promise<number[]>;
  /**
   * 获取用户内存分段
   * @param list 需要的内存分段索引
   */
  public getSegments(list: number[]): Promise<string[]>;
  /**
   * 发送一条在下一个 tick 运行的命令
   * @param expression 所要运行的命令
   */
  public console(expression: string): Promise<DBUserConsole>;
  /**
   * 从用户数据中检索需要的字段
   * @param name 字段名
   */
  public getData(name: keyof DBUser): Promise<unknown>;
  /**
   * 初始化控制台
   */
  public init(): Promise<User>;
}
