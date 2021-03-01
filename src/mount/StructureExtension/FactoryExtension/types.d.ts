// Factory 拓展
interface StructureFactory {
  // 查看工厂状态，在 room 的 fshow 中调用
  stats(): string;
}

/**
 * 工厂 1-5 级能生产的顶级商品
 */
interface ITopTargetConfig {
  1: CommodityConstant[];
  2: CommodityConstant[];
  3: CommodityConstant[];
  4: CommodityConstant[];
  5: CommodityConstant[];
}

/**
 * 工厂的任务队列中的具体任务配置
 */
interface IFactoryTask {
  // 任务目标
  target: CommodityConstant;
  // 该任务要生成的数量
  amount: number;
}

interface IFactoryLockAmount {
  [resourceType: string]: {
    sub: ResourceConstant;
    limit: number;
  };
}
