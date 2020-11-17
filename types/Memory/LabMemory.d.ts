interface LabMemory {
  // 当前集群的工作状态
  state: string;
  // 当前生产的目标产物索引
  targetIndex: number;
  // 当前要生产的数量
  targetAmount?: number;
  // 底物存放 lab 的 id
  inLab: Id<StructureLab>[];
  // 产物存放 lab 的 id
  outLab: {
    [labId: string]: number;
  };
  // 反应进行后下次反应进行的时间，值为 Game.time + cooldown
  reactionRunTime?: number;
  // lab 是否暂停运行
  pause: boolean;
}
