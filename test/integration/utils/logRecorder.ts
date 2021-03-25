import { outputJson } from "fs-extra";
import { resolve } from "path";

/**
 * tick 日志
 */
interface TickLog {
  /**
   * 该 tick 的控制台输出
   */
  console?: string[];
  /**
   * 该 tick 的通知信息
   */
  notifications?: string[];
  /**
   * 该 tick 的 Memory 完整拷贝
   */
  memory?: AnyObject;
}

const now = new Date();
/**
 * 本次测试日志要保持到的 log 文件夹路径
 * 形如：项目根目录/server/logs/2021-3-15 17-58-45
 */
const LOG_DIR = resolve(
  __dirname,
  `../server/logs/${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()} ${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`
);

/**
 * 日志记录者
 * 用于记录指定 bot 的运行日志
 */
export default class LogRecorder {
  /**
   * 保存到的日志文件名称
   */
  public readonly name: string;
  /**
   * 日志内容
   */
  public logs: { [tick: number]: TickLog } = {};

  /**
   * 实例化日志记录
   *
   * @param name 日志要保存到的文件名称
   * @param server 日志记录所在的游戏服务器
   * @param bot 要进行记录的 bot 实例
   */
  public constructor(name: string, server: ScreepsServer, bot: User) {
    this.name = name;

    // 记录控制台输出
    const consoleListener = async (logs: string[]) => {
      this.record(await server.world.gameTime, { console: logs });
    };

    // 记录 Memory 和通知信息
    const tickListener = async () =>
      this.record(await server.world.gameTime, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        memory: JSON.parse(await bot.memory),
        notifications: (await bot.newNotifications).map(({ message }) => message)
      });

    // 服务器重置时代表记录完成，取消回调并保存日志到本地
    const resetListener = () => {
      void this.save();
      void server.removeListener("tickStart", tickListener);
      void bot.removeListener("console", consoleListener);
      void server.removeListener("reset", resetListener);
    };

    // 注册回调
    void server.on("tickStart", tickListener);
    void bot.on("console", consoleListener);
    void server.on("reset", resetListener);
  }

  /**
   * 记录新的日志
   *
   * @param tick 要保存到的 tick
   * @param newLog 日志内容
   */
  public record(tick: number, newLog: TickLog): void {
    if (!this.logs[tick]) this.logs[tick] = newLog;
    else {
      Object.keys(newLog).forEach(key => {
        if (key in this.logs[tick]) return;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.logs[tick][key] = newLog[key];
      });
    }
    if (tick % 1000 === 0) void this.save(tick);
  }

  /**
   * 保存日志到本地
   */
  public async save(tick = 0): Promise<void> {
    await outputJson(resolve(LOG_DIR, `${this.name}-${tick}.json`), this.logs, {
      spaces: 4
    });
    // 主动移除内存中的日志，加速垃圾回收
    this.logs = {};
  }
}
