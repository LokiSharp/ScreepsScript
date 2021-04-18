import { getMock } from "./utils";
import { getMockRoom } from "./RoomMock";

class SourceMock {
  public energy = 3000;
  public energyCapacity = 3000;
  public id: Id<this> = `${new Date().getTime()}${Math.random()}` as Id<this>;
  public room: Room = getMockRoom();
  public ticksToRegeneration = 0;
}

export const getMockSource = getMock<Source>(SourceMock);
