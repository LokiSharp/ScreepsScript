import BaseMock from "./BaseMock";

export default class OwnerMock extends BaseMock {
  public username: string;

  public constructor(username: string) {
    super();
    this.username = username;
  }
}
