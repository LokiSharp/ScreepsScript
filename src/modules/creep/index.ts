import { creepNumberListener } from "./creepNumberListener";

/**
 * creep 数量控制模块注册插件
 */
export const creepNumberControlAppPlugin: AppLifecycleCallbacks = {
  tickStart: creepNumberListener
};
