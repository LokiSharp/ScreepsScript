interface Memory {
  /**
   * 所有 creep 的配置项，每次 creep 死亡或者新增时都会通过这个表来完成初始化
   */
  creepConfigs: {
    [creepName: string]: {
      // creep 的角色名
      role: CreepRoleConstant;
      // creep 的具体配置项，每个角色的配置都不相同
      data: CreepData;
      // 执行 creep 孵化的房间名
      spawnRoom: string;
    };
  };
}

interface Game {
  // 本 tick 是否已经执行了 creep 数量控制器了
  // 每 tick 只会调用一次
  hasRunCreepNumberController: boolean;
}