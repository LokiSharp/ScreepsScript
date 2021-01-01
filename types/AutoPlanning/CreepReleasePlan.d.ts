// 房间中用于发布 upgrader 所需要的信息
interface UpgraderPlanStats {
  // 房间对象
  room: Room;
  // 房间内的控制器等级
  controllerLevel: number;
  // 控制器还有多久降级
  ticksToDowngrade: number;
  // source 建造好的 container 的 id
  sourceContainerIds: Id<StructureContainer>[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: Id<StructureStorage>;
  // 房间内 terminal 的 id，房间没 terminal 时该值为空，下同
  terminalId?: Id<StructureTerminal>;
  // 房间内 upgradeLink 的 id
  upgradeLinkId?: Id<StructureLink>;
  // storage 中有多少能量
  storageEnergy?: number;
  // terminal 中有多少能量
  terminalEnergy?: number;
}
// 房间中用于发布 harvester 所需要的信息
interface HarvesterPlanStats {
  // 房间对象
  room: Room;
  // 房间内 source 的 id 和其配套的 link id
  sources: {
    id: Id<Source>;
    linkId: Id<StructureLink>;
  }[];
  // 房间内 storage 的 id，房间没 storage 时该值为空，下同
  storageId?: Id<StructureStorage>;
  // 房间内中央 link 的 id
  centerLinkId?: Id<StructureLink>;
}
// 发布角色配置项需要的素材集合
interface ReleasePlanConstructor<T> {
  // 搜集发布该角色需要的房间信息
  getStats: (room: Room) => T;
  // 发布计划的集合，会根据收集到的房间信息选择具体的计划
  plans: PlanNodeFunction[];
}
// 所有使用发布计划的角色
interface CreepReleasePlans {
  harvester: ReleasePlanConstructor<HarvesterPlanStats>;
  upgrader: ReleasePlanConstructor<UpgraderPlanStats>;
}

/**
 * creep 发布计划职责链上的一个节点
 *
 * @param detail 该 creep 发布所需的房间信息
 * @returns 代表该发布计划是否适合房间状态
 */
type PlanNodeFunction = (detail: UpgraderPlanStats | HarvesterPlanStats) => boolean;