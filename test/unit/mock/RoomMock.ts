import { BaseMock } from "@mock/BaseMock";
import { getMock } from "@mock/utils";
import { getMockVisual } from "@mock/RoomVisual";

export class RoomMock extends BaseMock {
  public name = "";
  public controller = {};
  public energyAvailable = 0;
  public energyCapacityAvailable = 0;
  public memory = {};
  public visual = getMockVisual();
  public log = (): void => {
    // PASS
  };
}

/**
 * 伪造一个 Room
 * @param props 属性
 */
export const getMockRoom = getMock<Room>(RoomMock);
