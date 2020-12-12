/**
 * 房间拓展
 * 来自于 mount.structure.ts
 */
interface Room {
  log(content: string, instanceName: string, color?: Colors | undefined, notify?: boolean): void;

  // creep 发布 api
  releaseCreep(role: CreepRoleConstant, releaseNumber?: number): ScreepsReturnCode;
  spawnReiver(sourceFlagName: string, targetStructureId: Id<StructureWithStore>): string;
  addRemoteHelper(remoteRoomName: string, wayPointFlagName?: string): void;
  addRemoteReserver(remoteRoomName: string, single?: boolean): void;
  addRemoteCreepGroup(remoteRoomName: string): void;
  removePbHarvesteGroup(attackerName: string, healerName: string): void;
  spawnPbCarrierGroup(flagName: string, releaseNumber: number): void;

  /**
   * 下述方法在 @see /src/mount.room.ts 中定义
   */
  // 孵化队列 api
  addSpawnTask(taskName: string): number | ERR_NAME_EXISTS;
  hasSpawnTask(taskName: string): boolean;
  clearSpawnTask(): void;
  hangSpawnTask(): void;

  // 房间物流 api
  addRoomTransferTask(task: RoomTransferTasks, priority?: number): number;
  hasRoomTransferTask(taskType: string): boolean;
  getRoomTransferTask(): RoomTransferTasks | null;
  handleLabInTask(resourceType: ResourceConstant, amount: number): boolean;
  deleteCurrentRoomTransferTask(): void;

  // 中央物流 api
  addCenterTask(task: ITransferTask, priority?: number): number;
  hasCenterTask(submit: CenterStructures | number): boolean;
  hangCenterTask(): number;
  handleCenterTask(transferAmount: number): void;
  getCenterTask(): ITransferTask | null;
  deleteCurrentCenterTask(): void;

  // pos 处理 api
  serializePos(pos: RoomPosition): string;
  unserializePos(posStr: string): RoomPosition | undefined;

  // 资源共享 api
  giver(roomName: string, resourceType: ResourceConstant, amount?: number): string;
  shareRequest(resourceType: ResourceConstant, amount: number): boolean;
  shareAddSource(resourceType: ResourceConstant): boolean;
  shareRemoveSource(resourceType: ResourceConstant): void;
  shareAdd(targetRoom: string, resourceType: ResourceConstant, amount: number): boolean;

  // boost api
  boost(
    boostType: string,
    boostConfig: IBoostConfig
  ): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_ARGS | ERR_NOT_ENOUGH_RESOURCES;
  boostCreep(creep: Creep): OK | ERR_NOT_FOUND | ERR_BUSY | ERR_NOT_IN_RANGE;

  // power 任务 api
  addPowerTask(task: PowerConstant, priority?: number): OK | ERR_NAME_EXISTS | ERR_INVALID_TARGET;
  deleteCurrentPowerTask(): void;
  getPowerTask(): PowerConstant | undefined;
  hangPowerTask(): void;

  // 战争相关
  startWar(boostType: BoostType): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET;
  stopWar(): OK | ERR_NOT_FOUND;

  // 房间基础服务
  [STRUCTURE_FACTORY]?: StructureFactory;
  [STRUCTURE_POWER_SPAWN]?: StructurePowerSpawn;
  [STRUCTURE_NUKER]?: StructureNuker;
  [STRUCTURE_OBSERVER]?: StructureObserver;
  [STRUCTURE_EXTRACTOR]?: StructureExtractor;

  [STRUCTURE_SPAWN]?: StructureSpawn[];
  [STRUCTURE_EXTENSION]?: StructureExtension[];
  [STRUCTURE_ROAD]?: StructureRoad[];
  [STRUCTURE_WALL]?: StructureWall[];
  [STRUCTURE_RAMPART]?: StructureRampart[];
  [STRUCTURE_KEEPER_LAIR]?: StructureKeeperLair[];
  [STRUCTURE_PORTAL]?: StructurePortal[];
  [STRUCTURE_LINK]?: StructureLink[];
  [STRUCTURE_TOWER]?: StructureTower[];
  [STRUCTURE_LAB]?: StructureLab[];
  [STRUCTURE_CONTAINER]?: StructureContainer[];

  mineral?: Mineral;
  source?: Source[];
  centerLink?: StructureLink;
  sourceContainers?: StructureContainer[];

  mineralCache: Mineral;
  sourcesCache: Source[];
  centerLinkCache: StructureLink;
  sourceContainersCache: StructureContainer[];

  // 已拥有的房间特有，tower 负责维护
  enemys: (Creep | PowerCreep)[];
  // 需要维修的建筑，tower 负责维护，为 1 说明建筑均良好
  damagedStructure: AnyStructure | 1;
  // 该 tick 是否已经有 tower 刷过墙了
  hasFillWall: boolean;
  // 外矿房间特有，外矿单位维护
  // 一旦该字段为 true 就告诉出生点暂时禁止自己重生直到 1500 tick 之后
  hasEnemy: boolean;
  hasRunLab: boolean;

  // 焦点墙，维修单位总是倾向于优先修复该墙体
  importantWall: StructureWall | StructureRampart;

  // 获取房间中的有效能量来源
  getAvailableSource():
    | StructureTerminal
    | StructureStorage
    | StructureContainer
    | Source
    | Ruin
    | Resource<RESOURCE_ENERGY>;

  // 自动规划相关
  findBaseCenterPos(): RoomPosition[];
  confirmBaseCenter(targetPos?: RoomPosition[]): RoomPosition | ERR_NOT_FOUND;
  setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS;
  planLayout(): string;
  clearStructure(): OK | ERR_NOT_FOUND;
  addRemote(remoteRoomName: string, targetId: Id<StructureWithStore>): OK | ERR_INVALID_TARGET | ERR_NOT_FOUND;
  removeRemote(remoteRoomName: string, removeFlag?: boolean): OK | ERR_NOT_FOUND;
  claimRoom(targetRoomName: string, signText?: string): OK;
  registerContainer(container: StructureContainer): OK;
}
