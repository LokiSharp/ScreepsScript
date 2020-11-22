// 小队的具体配置
interface SquadStrategy {
  // 小队的组成，键为角色，值为需要的数量
  member: {
    [role in CreepRoleConstant]?: number;
  };

  // 小队指令 - 治疗
  heal: (squad: SquadMember, memory: SquadMemory) => any;
  // 小队指令 - 攻击敌方单位
  attackCreep: (squad: SquadMember, memory: SquadMemory) => any;
  // 小队指令 - 攻击敌方建筑
  attackStructure: (squad: SquadMember, memory: SquadMemory) => any;
  // 寻路回调，在小队 getPath 中 PathFinder 的 roomCallback 中调用，用于添加小队自定义 cost
  findPathCallback?: (roomName: string, costs: CostMatrix) => CostMatrix;
  // 决定移动策略，参数是三个小队指令的返回值，返回是否继续前进（为 false 则后撤）
  getMoveStrategy?: (healResult: any, attackCreepResult: any, attackStructureResult: any) => boolean;
}
