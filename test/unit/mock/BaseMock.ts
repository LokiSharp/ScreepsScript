export class BaseMock {
  public calledRecords: CalledRecord[];

  public constructor() {
    this.calledRecords = [];
  }
}
