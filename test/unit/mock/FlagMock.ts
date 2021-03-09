import { RoomObjectMock } from "./RoomObjectMock";
import { getMock } from "@mock/utils";

export class FlagMock extends RoomObjectMock {
  public color: ColorConstant;
  public secondaryColor: ColorConstant;
  public name: string;
}

/**
 * 伪造一个 Flag
 * @param props 属性
 */
export const getMockFlag = getMock<Flag>(FlagMock);
