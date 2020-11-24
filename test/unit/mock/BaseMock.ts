export default class BaseMock {
  public called: Record<string, any[]>[];

  public constructor() {
    this.called = [];
  }
}
