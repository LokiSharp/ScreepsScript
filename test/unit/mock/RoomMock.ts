import { BaseMock } from "@mock/BaseMock";
import { getMock } from "@mock/utils";

export class RoomMock extends BaseMock {
  public name = "";
  public controller = {};
}

/**
 * 伪造一个 Room
 * @param props 属性
 */
export const getMockRoom = getMock<Room>(RoomMock);
