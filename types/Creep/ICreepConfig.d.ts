/**
 * creep 的配置项
 * @property isNeed 决定 creep 在死后是否需要再次孵化
 * @property prepare creep 在进入 source/target 状态机之前要执行的额外阶段
 * @property source creep非工作(收集能量时)执行的方法
 * @property target creep工作时执行的方法
 */
interface ICreepConfig {
  isNeed?: (room: Room, creepName: string, preMemory: CreepMemory | PowerCreepMemory) => boolean;
  prepare?: (creep: Creep) => boolean;
  source?: (creep: Creep) => boolean;
  target?: (creep: Creep) => boolean;
  bodys: (room: Room, spawn: StructureSpawn) => BodyPartConstant[];
}
