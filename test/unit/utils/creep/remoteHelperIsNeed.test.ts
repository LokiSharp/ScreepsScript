import { assert } from "chai";
import { getMockGame } from "@mock/GameMock";
import { getMockMemory } from "@mock/MemoryMock";
import { getMockRoom } from "@mock/RoomMock";
import { getMockStructureController } from "@mock/StructureControllerMock";
import { getMockStructureSpawn } from "@mock/StructureSpawnMock";
import remoteHelperIsNeed from "@/utils/creep/remoteHelperIsNeed";

describe("remoteHelperIsNeed", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = getMockGame();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = getMockMemory();
  });

  it("targetRoom undefined 时返回 true", () => {
    const sourceRoom = getMockRoom({ name: "sourceRoom" });
    const targetRoom = undefined;
    const result = remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => true);
    assert.isTrue(result);
  });

  it("customCondition 结果为 true 时返回 false", () => {
    const sourceRoom = getMockRoom({ name: "sourceRoom" });
    const targetRoom = getMockRoom({ name: "targetRoom" });
    const result = remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => true);
    assert.isFalse(result);
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
      assert.isFalse(
        remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false),
        `RCL ${level}`
      );
    });

    [7, 8].forEach(level => {
      sourceRoom.controller.level = level;
      assert.isTrue(
        remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false),
        `RCL ${level}`
      );
    });

    sourceRoom.controller = undefined;
    assert.isTrue(remoteHelperIsNeed((sourceRoom as unknown) as Room, (targetRoom as unknown) as Room, () => false));
  });
});
