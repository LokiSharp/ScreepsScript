import GlobalExtension from "./GlobalExtension";

// 挂载全局拓展
export default function (): void {
  // 挂载没有别名的操作
  _.assign(global, GlobalExtension);
}
