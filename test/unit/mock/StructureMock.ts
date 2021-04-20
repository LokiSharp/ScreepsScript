import { getMockRoom } from "./RoomMock";

export class StructureMock {
  public hits = 1000;
  public hitsMax = 1000;
  public id = `${new Date().getTime()}${Math.random()}`;
  public room = getMockRoom();
  public structureType = "controller";
  public destroy = (): void => {
    // PASS
  };
  public isActive = (): boolean => true;
  public notifyWhenAttacked = (): void => {
    // PASS
  };

  public constructor(structureType: StructureConstant) {
    this.structureType = structureType;
  }
}
