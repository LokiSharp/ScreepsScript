import GlobalAlias from "./GlobalAlias";
import GlobalExtension from "./GlobalExtension";

// 挂载全局拓展
export default function (): void {
  // 挂载有别名的操作
  GlobalAlias.map(item => {
    Object.defineProperty(global, item.alias, { get: item.exec });
  });
  // 挂载没有别名的操作
  _.assign(global, GlobalExtension);
}
