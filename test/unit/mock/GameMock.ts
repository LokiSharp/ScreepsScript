import CPUMock from "./CPUMock";

export default class GameMock {
  public cpu: CPUMock;

  public constructor() {
    this.cpu = new CPUMock();
  }
}
