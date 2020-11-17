interface ModuleDescribe {
  // 模块名
  name: string;
  // 模块介绍
  describe: string;
  // 该模块的 api 列表
  api: FunctionDescribe[];
}
