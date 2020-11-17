declare namespace NodeJS {
  // 全局对象
  interface Global {
    InterShardMemory: InterShardMemory;
    // 是否已经挂载拓展
    hasExtension: boolean;
  }
}
