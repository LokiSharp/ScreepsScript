import BaseMock from "./BaseMock";

export default class MemoryMock extends BaseMock implements Memory {
  public constructor() {
    super();
    this.flags = {};
    this.whiteList = {};
    this.stats = {
      rooms: {}
    };
    this.creeps = {};
    this.powerCreeps = {};
    this.flags = {};
    this.rooms = {};
    this.spawns = {};
  }

  public creeps: { [name: string]: CreepMemory };
  public powerCreeps: { [name: string]: PowerCreepMemory };
  public flags: { [name: string]: FlagMemory };
  public rooms: { [name: string]: RoomMemory };
  public spawns: { [name: string]: SpawnMemory };

  public moveNumber?: number;
  public moveUseCpu?: number;

  public nukerLock?: boolean;
  public nukerDirective?: {
    [fireRoomName: string]: string;
  };

  public creepConfigs: {
    [creepName: string]: {
      role: CreepRoleConstant;
      data: CreepData;
      spawnRoom: string;
    };
  };

  public crossShardCreeps: {
    [creepName: string]: CreepMemory | PowerCreepMemory;
  };

  public bypassRooms: string[];
  public reiveList: ResourceConstant[];

  public commodities: {
    1: string[];
    2: string[];
    3: string[];
    4: string[];
    5: string[];
  };

  public resourceSourceMap: {
    [resourceType: string]: string[];
  };

  public whiteList: {
    [userName: string]: number;
  };

  public stats: {
    gcl?: number;
    gclLevel?: number;
    gpl?: number;
    gplLevel?: number;
    cpu?: number;
    bucket?: number;
    credit?: number;

    roomTaskNumber?: { [roomTransferTaskType: string]: number };

    rooms: {
      [roomName: string]: {
        energy?: number;
        power?: number;
        nukerEnergy?: number;
        nukerG?: number;
        nukerCooldown?: number;
        controllerRatio?: number;
        controllerLevel?: number;
        structureNums?: { [structureName: string]: number };
        constructionSiteNums?: { [structureName: string]: number };
        upgraderWorkingTime: number;
        upgraderLifeTime: number;
        transporterWorkingTime: number;
        transporterLifeTime: number;
        commRes: { [commType: string]: number };
      };
    };
  };

  public psRooms: string[];

  public layoutInfo?: BaseLayout;
  public layoutLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  public delayTasks: DelayTaskMemory[];
}
