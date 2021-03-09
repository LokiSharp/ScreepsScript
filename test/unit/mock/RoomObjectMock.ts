import { GameObjectMock } from "./GameObjectMock";
import { getMock } from "@mock/utils";
import { getMockRoom } from "@mock/RoomMock";
import { getMockRoomPosition } from "./RoomPositionMock";

export class RoomObjectMock extends GameObjectMock {
  public effects = [];
  public pos = getMockRoomPosition();
  public room = getMockRoom({ name: "W1N1" });
}

/**
 * 伪造一个 RoomObject
 * @param props 属性
 */
export const getMockRoomObject = getMock<RoomObject>(RoomObjectMock);
