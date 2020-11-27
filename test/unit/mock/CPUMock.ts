import BaseMock from "./BaseMock";
import { pushMethodCallInfoToCalled } from "./pushMethodCallInfoToCalled";

export default class CPUMock extends BaseMock {
  public cpuUsed: number;

  public limit: number;
  public tickLimit: number;
  public bucket: number;
  public shardLimits: CPUShardLimits;
  public unlocked: boolean;
  public unlockedTime: number | undefined;

  public constructor() {
    super();
    this.cpuUsed = 0;
    this.limit = 0;
    this.tickLimit = 0;
    this.bucket = 0;
  }

  public getUsed(): number {
    return this.cpuUsed;
  }
  @pushMethodCallInfoToCalled
  public setShardLimits(): OK | ERR_BUSY | ERR_INVALID_ARGS {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public getHeapStatistics?(): HeapStatistics {
    return {} as HeapStatistics;
  }
  @pushMethodCallInfoToCalled
  public halt?(): never {
    throw new Error("CPU halted");
  }
  @pushMethodCallInfoToCalled
  public generatePixel(): OK | ERR_NOT_ENOUGH_RESOURCES {
    return OK;
  }
  @pushMethodCallInfoToCalled
  public unlock(): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_FULL {
    return OK;
  }
}
