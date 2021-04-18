import { RoomObjectMock } from "./RoomObjectMock";
import { getMock } from "@mock/utils";

export class StructureControllerMock extends RoomObjectMock {
  public structureType = STRUCTURE_CONTROLLER;
}

/**
 * 伪造一个 StructureController
 * @param props 属性
 */
export const getMockStructureController = getMock<StructureController>(StructureControllerMock);
