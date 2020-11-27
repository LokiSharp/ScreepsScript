import BaseMock from "./BaseMock";

export default class GlobalControlLevel extends BaseMock {
  public level: number;
  public progress: number;
  public progressTotal: number;

  public constructor(level = 0, progress = 0, progressTotal = 0) {
    super();
    this.level = level;
    this.progress = progress;
    this.progressTotal = progressTotal;
  }
}
