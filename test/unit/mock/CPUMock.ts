export default class CPUMock {
  public cpuUsed: number;
  public getUsed(): number {
    if (!this.cpuUsed) {
      this.cpuUsed = 0;
    }
    this.cpuUsed += 1;
    return this.cpuUsed;
  }
}
