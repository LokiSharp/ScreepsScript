import { RoomObjectMock } from "./RoomObjectMock";
import { getMock } from "@mock/utils";

export class StructureSpawnMock extends RoomObjectMock {
  public structureType = STRUCTURE_SPAWN;
}

/**
 * 伪造一个 StructureSpawn
 * @param props 属性
 */
export const getMockStructureSpawn = getMock<StructureSpawn>(StructureSpawnMock);
