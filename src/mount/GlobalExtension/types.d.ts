interface Memory {
  // 核弹投放指示器
  // 核弹是否已经确认
  nukerLock?: boolean;
  // 核弹发射指令集，键为发射房间，值为目标旗帜名称
  nukerDirective?: {
    [fireRoomName: string]: string;
  };

  // 要绕过的房间名列表，由全局模块 bypass 负责。
  bypassRooms: string[];
  // 掠夺资源列表，如果存在的话 reiver 将只会掠夺该名单中存在的资源
  reiveList: ResourceConstant[];

  // 商品生产线配置
  commodities: {
    // 键为工厂等级，值为被设置成对应等级的工厂所在房间名
    1: string[];
    2: string[];
    3: string[];
    4: string[];
    5: string[];
  };

  // 资源来源表
  resourceSourceMap: {
    // 资源类型为键，房间名列表为值
    [resourceType: string]: string[];
  };

  // 白名单，通过全局的 whitelist 对象控制
  // 键是玩家名，值是该玩家进入自己房间的 tick 时长
  whiteList: {
    [userName: string]: number;
  };

  // 启动 powerSpawn 的房间名列表
  psRooms: string[];

  /**
   * 延迟任务存储
   */
  delayTasks: DelayTaskMemory[];
}
