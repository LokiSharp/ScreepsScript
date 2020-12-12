import BaseMock from "./BaseMock";
import RoomPositionMock from "./RoomPositionMock";

export default class RoomObjectMock extends BaseMock {
  public effects: RoomObjectEffect[];
  public pos: RoomPositionMock;
  public room: Room | undefined;

  public constructor(x = 0, y = 0) {
    super();
    this.pos = new RoomPositionMock(x, y);
  }
}
