/**
 * creep 工作逻辑集合
 * 包含了每个角色应该做的工作
 */
type CreepWork = {
  [role in CreepRoleConstant]: (data: CreepData) => ICreepConfig;
};
