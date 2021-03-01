interface ModuleDescribe {
  // 模块名
  name: string;
  // 模块介绍
  describe: string;
  // 该模块的 api 列表
  api: FunctionDescribe[];
}

// 函数介绍构造函数的参数对象
interface FunctionDescribe {
  // 该函数的用法
  title: string;
  // 参数介绍
  describe?: string;
  // 该函数的参数列表
  params?: {
    // 参数名
    name: string;
    // 参数介绍
    desc: string;
  }[];
  // 函数名
  functionName: string;
  // 是否为直接执行类型：不需要使用 () 就可以执行的命令
  commandType?: boolean;
}
