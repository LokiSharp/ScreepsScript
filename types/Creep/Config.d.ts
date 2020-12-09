/**
 * creep 的配置项
 */
interface CreepConfig<Role extends CreepRoleConstant> {
  /**
   * 该 creep 是否需要
   *
   * 每次死后都会进行判断，只有返回 true 时才会重新发布孵化任务
   * 该方法为空则默认持续孵化
   */
  isNeed?: (room: Room, preMemory: CreepMemory<Role>) => boolean;
  /**
   * 准备阶段
   *
   * creep 出生后会执行该方法来完成一些需要准备的工作，返回 true 时代表准备完成
   * 该方法为空则直接进入 source 阶段
   */
  prepare?: (creep: Creep<Role>) => boolean;
  /**
   * 获取工作资源阶段
   *
   * 返回 true 则执行 target 阶段，返回其他将继续执行该方法
   * 该方法为空则一直重复执行 target 阶段
   */
  source?: (creep: Creep<Role>) => boolean;
  /**
   * 工作阶段
   *
   * 返回 true 则执行 source 阶段，返回其他将继续执行该方法
   * 该方法不可未空
   */
  target: (creep: Creep<Role>) => boolean;
  /**
   * 每个角色默认的身体组成部分
   */
  bodys: (room: Room, spawn: StructureSpawn, data: RoleDatas[Role]) => BodyPartConstant[];
}

interface ICreepStage<Role extends CreepRoleConstant> {
  isNeed?: (room: Room, preMemory: CreepMemory<Role>) => boolean;
  prepare?: (creep: Creep<Role>) => boolean;
  source?: (creep: Creep<Role>) => boolean;
  target?: (creep: Creep<Role>) => boolean;
}
