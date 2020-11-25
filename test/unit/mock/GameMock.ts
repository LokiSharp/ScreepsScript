import BaseMock from "./BaseMock";
import CPUMock from "./CPUMock";

export default class GameMock extends BaseMock {
  public cpu: CPUMock;
  public flags: { [flagName: string]: Flag };

  public constructor() {
    super();
    this.cpu = new CPUMock();
    this.flags = {};
  }
}
