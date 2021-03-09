import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class RoomPositionMock extends BaseMock {
  public roomName = "";
  public x = 0;
  public y = 0;

  public isEqualTo(x: number, y: number): boolean {
    return x === this.x && y === this.y;
  }
}

/**
 * 伪造一个 RoomPosition
 * @param props 属性
 */
export const getMockRoomPosition = getMock<RoomPosition>(RoomPositionMock);
