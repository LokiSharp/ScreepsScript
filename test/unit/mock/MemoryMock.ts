import BaseMock from "./BaseMock";

export default class MemoryMock extends BaseMock {
  public showCost: boolean;

  public flags: { [flagName: string]: FlagMemory };

  public whiteList: {
    [userName: string]: number;
  };

  public stats: {
    // GCl/GPL 升级百分比
    gcl?: number;
    gclLevel?: number;
    gpl?: number;
    gplLevel?: number;
    // CPU 当前数值及百分比
    cpu?: number;
    // bucket 当前数值
    bucket?: number;
    // 当前还有多少钱
    credit?: number;

    // 已经完成的房间物流任务比例
    roomTaskNumber?: { [roomTransferTaskType: string]: number };

    /**
     * 房间内的数据统计
     */
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
      };
    };
  };

  public constructor() {
    super();
    this.flags = {};
    this.whiteList = {};
    this.stats = {
      rooms: {}
    };
  }
}
