interface transferTaskOperation {
  // creep 工作时执行的方法
  target: (creep: Creep, task: RoomTransferTasks) => boolean;
  // creep 非工作(收集资源时)执行的方法
  source: (creep: Creep, task: RoomTransferTasks, sourceId: Id<StructureWithStore>) => boolean;
}
