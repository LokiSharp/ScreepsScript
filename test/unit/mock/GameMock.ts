import BaseMock from "./BaseMock";
import CPUMock from "./CPUMock";
import CreepMock from "./CreepMock";
import GlobalControlLevelMock from "./GlobalControlLevelMock";
import GlobalPowerLevelMock from "./GlobalPowerLevelMock";
import MarketMock from "./MarketMock";
import RoomMock from "./RoomMock";
import RoomObjectMock from "./RoomObjectMock";
import ShardMock from "./ShardMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class GameMock extends BaseMock {
  public cpu: CPUMock;
  public flags: { [flagName: string]: Flag };
  public gcl: GlobalControlLevelMock;
  public gpl: GlobalPowerLevelMock;
  public market: MarketMock;
  public time: number;
  public shard: ShardMock;
  public rooms: Record<string, RoomMock>;
  public creeps: Record<string, CreepMock>;
  public roomObjects: Record<string, RoomObjectMock>;

  public constructor() {
    super();
    this.cpu = new CPUMock();
    this.flags = {};
    this.gcl = new GlobalControlLevelMock();
    this.gpl = new GlobalPowerLevelMock();
    this.market = new MarketMock();
    this.shard = new ShardMock();

    this.rooms = {};
    this.creeps = {};
    this.roomObjects = {};
  }

  @pushMethodCallInfoToCalled
  public notify(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public getObjectById(): void {
    // PASS
  }
}
