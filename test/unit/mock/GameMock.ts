import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";
import { getMockCPU } from "./CPUMock";
import { getMockMarket } from "./MarketMock";
import { getMockShard } from "./ShardMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export class GameMock extends BaseMock {
  public cpu = getMockCPU();
  public flags = {};
  public gcl = 1;
  public gpl = 1;
  public market = getMockMarket();
  public time = 0;
  public shard = getMockShard();
  public rooms = {};
  public creeps = {};
  public roomObjects = {};

  @pushMethodCallInfoToCalled
  public notify(): void {
    // PASS
  }

  @pushMethodCallInfoToCalled
  public getObjectById(): void {
    // PASS
  }
}

/**
 * 伪造一个 CPU
 * @param props 属性
 */
export const getMockGame = getMock<Game>(GameMock);
