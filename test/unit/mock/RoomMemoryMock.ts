import BaseMock from "./BaseMock";

export default class RoomMemoryMock extends BaseMock implements RoomMemory {
  public removeTime?: number;
  public spawnList?: string[];
  public delayCSList: string[];

  public sourceContainersIds: Id<StructureContainer>[];
  public constructionSiteIds: Id<ConstructionSite>[];

  public centerLinkId?: Id<StructureLink>;
  public upgradeLinkId?: Id<StructureLink>;

  public center: [number, number];
  public centerCandidates?: [number, number][];
  public noLayout: boolean;

  public observer: {
    checkRoomName?: string;
    watchIndex: number;
    watchRooms: string[];
    pbList: string[];
    depoList: string[];
    pause?: boolean;
  };

  public constructionSiteId: Id<ConstructionSite>;
  public constructionSiteType?: StructureConstant;
  public constructionSitePos: number[];

  public focusWall: {
    id: Id<StructureWall | StructureRampart>;
    endTime: number;
  };

  public centerTransferTasks: ITransferTask[];

  public transport: string;

  public defenseMode?: "defense" | "active";

  public remote: {
    [roomName: string]: {
      disableTill?: number;
      targetId: Id<StructureWithStore>;
    };
  };

  public terminalTasks: string[];
  public targetOrderId?: Id<Order>;
  public targetSupportRoom?: string;
  public terminalIndex: number;

  public shareTask: IRoomShareTask;

  public lab?: LabMemory;

  public war?: Record<string, unknown>;

  public boost?: BoostTask;

  public pausePS?: boolean;

  public powerTasks: PowerConstant[];

  public powers?: string;

  public factory: {
    level?: 1 | 2 | 3 | 4 | 5;
    targetIndex: number;
    depositTypes?: DepositConstant[];
    produceCheck?: boolean;
    state: string;
    taskList: IFactoryTask[];
    remove?: true;
    pause?: true;
    sleep?: number;
    sleepReason?: string;
    specialTraget?: CommodityConstant;
  };

  public mineralCooldown: number;

  public resourceKeepInfo?: {
    terminal?: IResourceKeepInfo;
  };

  public targetHostileStructuresCache: Id<Structure>[];
  public targetHostileStructuresCacheExpireTime: number;
  public targetHostileCreepsCache: Id<AnyCreep>[];
  public targetHostileCreepsCacheExpireTime: number;
}
