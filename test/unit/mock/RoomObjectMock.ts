import RoomPositionMock from "./RoomPositionMock";

export default class RoomObjectMock {
  public effects: RoomObjectEffect[];
  public pos: RoomPositionMock;
  public room: Room | undefined;

  public constructor(x: number, y: number) {
    this.pos = new RoomPositionMock(x, y);
  }
}
