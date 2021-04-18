import { RoomObjectMock } from "./RoomObjectMock";
import { getMock } from "@mock/utils";

export class StructureTerminalMock extends RoomObjectMock {
  public structureType = STRUCTURE_TERMINAL;
}

/**
 * 伪造一个 StructureTerminal
 * @param props 属性
 */
export const getMockStructureTerminal = getMock<StructureTerminal>(StructureTerminalMock);
