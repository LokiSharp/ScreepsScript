type RoomTransferTasks =
  | IFillExtension
  | IFillTower
  | ILabIn
  | ILabOut
  | IBoostGetResource
  | IBoostGetEnergy
  | IBoostClear
  | IFillNuker
  | IFillPowerSpawn;
// 房间物流任务 - 填充拓展
interface IFillExtension {
  type: string;
}
// 房间物流任务 - 填充塔
interface IFillTower {
  type: string;
  id: Id<StructureTower>;
}
// 房间物流任务 - 填充 PowerSpawn
interface IFillPowerSpawn {
  type: string;
  id: Id<StructurePowerSpawn>;
  resourceType: ResourceConstant;
}
// 房间物流任务 - lab 底物填充
interface ILabIn {
  type: string;
  resource: {
    id: Id<StructureLab>;
    type: ResourceConstant;
    amount: number;
  }[];
}
// 房间物流任务 - lab 产物移出
interface ILabOut {
  type: string;
}
// 房间物流任务 - boost 资源填充
interface IBoostGetResource {
  type: string;
}
// 房间物流任务 - boost 能量填充
interface IBoostGetEnergy {
  type: string;
}
// 房间物流任务 - boost 资源清理
interface IBoostClear {
  type: string;
}
// 房间物流任务 - 填充核弹
interface IFillNuker {
  type: string;
  id: Id<StructureNuker>;
  resourceType: ResourceConstant;
}
