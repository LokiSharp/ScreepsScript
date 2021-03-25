// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { ScreepsServer } = require("screeps-server-mockup");
import LogRecorder from "./logRecorder";

/**
 * 全局唯一的 server 实例
 */
let server: ScreepsServer;

/**
 * 升级 server 实例
 * 添加更多的事件发射，并添加自动日志记录
 *
 * @param newServer 要进行升级的 server 实例
 * @returns 升级后的 server 实例
 */
const upgradeServer = function (newServer: ScreepsServer) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { tick } = newServer;
  // 发射 tick 开始事件
  newServer.tick = async function () {
    void newServer.emit("tickStart");
    return tick.apply(this) as Promise<ScreepsServer>;
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { reset, addBot } = newServer.world;
  // 发射服务器重置事件
  newServer.world.reset = async function () {
    void newServer.emit("reset");
    return reset.apply(this) as Promise<ScreepsServer>;
  };
  // 在添加 bot 时同步启动日志记录实例
  // 会在 server reset 时自动保存并释放
  newServer.world.addBot = async function (...args) {
    const [addBotOptions] = args;
    const { username } = addBotOptions;

    const bot = (await addBot.apply(this, args)) as User;
    new LogRecorder(username, newServer, bot);

    return bot;
  };

  return newServer;
};

/**
 * 获取可用的 server 实例
 * @returns server 实例
 */
export const getServer = async function (): Promise<ScreepsServer> {
  if (!server) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    server = upgradeServer(new ScreepsServer());
    if (!server.users) server.users = [];
    await server.start();
  }

  return server;
};

/**
 * 重置 server
 */
export const resetServer = async function (): Promise<void> {
  if (!server) return;
  await server.world.reset();
};

/**
 * 停止 server
 */
export const stopServer = async function (): Promise<void> {
  if (!server) return;

  // monkey-patch 用于屏蔽 screeps storage 的退出提示
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const error = global.console.error;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  global.console.error = (...arg) => !arg[0].match(/Storage connection lost/i) && error.apply(this, arg);

  await server.stop();
};

/**
 * 添加基础房间并设置需要的房间对象
 *
 * @param targetServer 要进行设置的服务器
 * @param roomName 要添加的房间名称
 */
export const setBaseRoom = async function (targetServer: ScreepsServer, roomName = "W0N1"): Promise<void> {
  await targetServer.world.addRoom(roomName);
  await targetServer.world.addRoomObject(roomName, "controller", 10, 10, { level: 0 });
  await targetServer.world.addRoomObject(roomName, "source", 10, 40, {
    energy: 1000,
    energyCapacity: 1000,
    ticksToRegeneration: 300
  });
  await targetServer.world.addRoomObject(roomName, "mineral", 40, 40, {
    mineralType: "H",
    density: 3,
    mineralAmount: 3000
  });
};
