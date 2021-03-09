import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class RoomMemoryMock extends BaseMock {}

/**
 * 伪造一个 RoomMemory
 * @param props 属性
 */
export const getMockRoomMemory = getMock<RoomMemory>(RoomMemoryMock);
