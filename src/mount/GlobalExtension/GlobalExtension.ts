import { base, give, hail, orderExtend, seeres } from "@/mount/GlobalExtension/extension/common";
import { cancelNuker as cancelnuker, confirmNuker as confirmnuker, nuker } from "@/mount/GlobalExtension/alias/nuker";
import { hasCreep, removeCreep, showCreep } from "@/modules/creep/utils";
import bypass from "@/mount/GlobalExtension/extension/bypass";
import { clearFlag } from "@/utils/global/clearFlag";
import comm from "@/mount/GlobalExtension/alias/commodity";
import help from "@/mount/GlobalExtension/alias/help";
import ob from "@/mount/GlobalExtension/alias/observer";
import ps from "@/mount/GlobalExtension/alias/powerSpawn";
import reive from "@/mount/GlobalExtension/extension/reive";
import { resourcesHelp as res } from "@/mount/GlobalExtension/alias/resourcesHelp";
import route from "@/mount/GlobalExtension/alias/route";
import storage from "@/mount/GlobalExtension/alias/storage";
import whitelist from "@/mount/GlobalExtension/extension/whiteList";

// 全局拓展对象
export default {
  // Game.getObjectById 别名
  // eslint-disable-next-line @typescript-eslint/unbound-method,deprecation/deprecation
  get: Game.getObjectById,
  // 挂单别名
  orderExtend,
  // 移除过期旗帜
  clearFlag,
  // 资源查询
  seeres,
  // 欢呼
  hail,
  // 基地查找
  base,
  // 全局发送资源到指定房间
  give,
  // 将 creepApi 挂载到全局方便手动操作
  creep: {
    show: showCreep,
    remove: removeCreep,
    has: hasCreep
  },
  // 绕路模块
  bypass,
  // 掠夺模块
  reive,
  // 白名单
  whitelist,

  // 显示当前商品生产状态
  comm,
  // 常用的资源常量
  res,
  // 全局帮助信息
  help,
  // 显示路径缓存
  route,
  // 挂载 nuker 相关
  nuker,
  cancelnuker,
  confirmnuker,
  // 挂载全局建筑状态查看
  ps,
  ob,
  storage,

  /**
   * 把房间挂载到全局
   * 来方便控制台操作，在访问时会实时的获取房间对象
   * 注意：仅会挂载 Memory.rooms 里有的房间
   */
  ...Object.keys(Memory.rooms || {}).map(roomName => ({
    alias: roomName,
    exec: (): Room => Game.rooms[roomName]
  }))
};
