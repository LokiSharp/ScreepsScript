import BaseMock from "./BaseMock";

export default class CPUMock extends BaseMock {
  public cpuUsed: number;
  public getUsed(): number {
    if (!this.cpuUsed) {
      this.cpuUsed = 0;
    }
    this.cpuUsed += 1;
    return this.cpuUsed;
  }
}
