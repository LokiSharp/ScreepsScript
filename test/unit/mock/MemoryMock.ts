import BaseMock from "./BaseMock";

export default class MemoryMock extends BaseMock {
  public showCost: boolean;

  public flags: { [flagName: string]: FlagMemory };

  public constructor() {
    super();
    this.flags = {};
  }
}
