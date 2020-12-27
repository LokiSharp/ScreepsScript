declare interface ScreepServerOptions {
  path: string;
  logdir: string;
  port: number;
  modfile?: string;
}
declare class Server {
  public driver: Driver;
  public config: CommonConfig;
  public common: Common;
  public constants: CommonConstants;
  public connected: boolean;
  public processes: {
    [name: string]: any;
  };
  public world: World;
  private usersQueue?;
  private roomsQueue?;
  private opts;
  public constructor(opts?: Partial<ScreepServerOptions>);
  /**
   * 生成服务器选项，用自定义服务器选项覆盖默认值
   * @param opts 自定义选项
   */
  private static computeDefaultOpts;
  /**
   * 设置服务器选项，用自定义服务器选项覆盖默认值
   * @param opts 自定义选项
   */
  public setOpts(opts: ScreepServerOptions): Server;
  /**
   * 获取服务器选项
   */
  public getOpts(): ScreepServerOptions;
  /**
   * 启动 storage 进程并连接到 driver
   */
  public connect(): Promise<Server>;
  /**
   * 运行一个 tick
   */
  public tick(): Promise<Server>;
  /**
   * 启动一个带环境变量的子进程
   * @param name 进程名
   * @param execPath 脚本路径
   * @param env 环境变量
   */
  public startProcess(name: string, execPath: string, env: Record<string, string>): Promise<any>;
  /**
   * 启动进程并连接到 driver.
   */
  public start(): Promise<Server>;
  public stop(): Server;
}
