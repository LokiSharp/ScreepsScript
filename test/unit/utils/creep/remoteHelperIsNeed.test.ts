import { getMockRoom } from "@mock/RoomMock";
import { getMockStructureController } from "@mock/StructureControllerMock";
import { getMockStructureSpawn } from "@mock/StructureSpawnMock";
import remoteHelperIsNeed from "@/utils/creep/remoteHelperIsNeed";

describe("remoteHelperIsNeed", () => {
  it("targetRoom undefined 时返回 true", () => {
    const sourceRoom = getMockRoom({ name: "sourceRoom" });
    const targetRoom = undefined;
    const result = remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => true);
    expect(result).toBeTruthy();
  });

  it("customCondition 结果为 true 时返回 false", () => {
    const sourceRoom = getMockRoom({ name: "sourceRoom" });
    const targetRoom = getMockRoom({ name: "targetRoom" });
    const result = remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => true);
    expect(result).toBeFalsy();
  });

  it("customCondition 结果为 false 时，检查 RCL < 7 时返回 false, RCL > 7 时返回 true", () => {
    const sourceRoomController = getMockStructureController();
    const sourceRoom = getMockRoom({ name: "sourceRoom" });
    const targetRoom = getMockRoom({ name: "targetRoom" });
    sourceRoom.controller = (sourceRoomController as unknown) as StructureController;
    const targetRoomSpawn = getMockStructureSpawn();
    targetRoom[STRUCTURE_SPAWN] = [(targetRoomSpawn as unknown) as StructureSpawn];

    [1, 2, 3, 4, 5, 6].forEach(level => {
      sourceRoom.controller.level = level;
      expect(
        remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false)
      ).toBeFalsy();
    });

    [7, 8].forEach(level => {
      sourceRoom.controller.level = level;
      expect(
        remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false)
      ).toBeTruthy();
    });

    sourceRoom.controller = undefined;
    expect(
      remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false)
    ).toBeTruthy();
  });
});
