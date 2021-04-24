import GlobalExtension from "./GlobalExtension";

// 挂载全局拓展
export default function mountGlobal(): void {
  _.assign(global, GlobalExtension);
}
