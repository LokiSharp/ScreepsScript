import BaseMock from "./BaseMock";
import RoomPositionMock from "./RoomPositionMock";

export default class RoomObjectMock extends BaseMock {
  public effects: RoomObjectEffect[];
  public pos: RoomPositionMock;
  public room: Room | undefined;

  public constructor(x: number, y: number) {
    super();
    this.pos = new RoomPositionMock(x, y);
  }
}
