// 战斗小队的基础信息
interface SquadBase<IN_MEMORY extends boolean> {
  // 是否准备就绪
  ready: boolean;
  // 小队路径
  path: string;
  // 小队前进方向
  direction: DirectionConstant;
  // 目标建筑
  targetStructures: IN_MEMORY extends true ? Id<Structure>[] : Structure[];
  // 目标 creep
  targetCreep: IN_MEMORY extends true ? Id<Creep | PowerCreep>[] : (Creep | PowerCreep)[];
}
