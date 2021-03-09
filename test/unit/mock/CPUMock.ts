import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export class CPUMock extends BaseMock {
  public cpuUsed = 0;

  public limit = 100;
  public tickLimit = 100;
  public bucket = 10000;
  public shardLimits = 20;
  public unlocked = true;
  public unlockedTime = 0;

  @pushMethodCallInfoToCalled
  public getUsed(): number {
    return this.cpuUsed;
  }
  @pushMethodCallInfoToCalled
  public setShardLimits(): OK | ERR_BUSY | ERR_INVALID_ARGS {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public getHeapStatistics?(): HeapStatistics {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public halt?(): never {
    throw new Error("CPU halted");
  }
  @pushMethodCallInfoToCalled
  public generatePixel(): OK | ERR_NOT_ENOUGH_RESOURCES {
    return undefined;
  }
  @pushMethodCallInfoToCalled
  public unlock(): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL {
    return undefined;
  }
}

/**
 * 伪造一个 CPU
 * @param props 属性
 */
export const getMockCPU = getMock<CPU>(CPUMock);
