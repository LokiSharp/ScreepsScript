import { BaseMock } from "./BaseMock";

export class GameObjectMock extends BaseMock {
  public id = `${new Date().getTime()}${Math.random()}`;
  public my = true;
  public owner = "";
  public memory = {};
}
