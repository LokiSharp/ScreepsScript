import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";
import RoomMemoryMock from "../../mock/RoomMemoryMock";
import RoomMock from "../../mock/RoomMock";
import StructureTerminalMock from "../../mock/StructureTerminalMock";
import { assert } from "chai";
import getRoomFactoryState from "../../../../src/utils/global/getRoomFactoryState";

describe("getRoomFactoryState", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = _.clone(new GameMock());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = _.clone(new MemoryMock());
  });

  it("可以获取工厂状态 工厂未设置等级", () => {
    const testRoom = new RoomMock("testRoom");
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text>工厂未设置等级'
    );
  });

  it("可以获取工厂状态 工厂未设置生产线", () => {
    const testRoom = new RoomMock("testRoom");
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: []
    };
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text>工厂未设置生产线'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中", () => {
    const testRoom = new RoomMock("testRoom");
    testRoom.terminal = new StructureTerminalMock(25, 25);
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [],
      depositTypes: [RESOURCE_MIST]
    };
    testRoom.terminal.store[RESOURCE_CONCENTRATE] = 1;
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 暂停中", () => {
    const testRoom = new RoomMock("testRoom");
    testRoom.terminal = new StructureTerminalMock(25, 25);
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [],
      depositTypes: [RESOURCE_MIST],
      pause: true
    };
    testRoom.terminal.store[RESOURCE_CONCENTRATE] = 1;
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #c5c599; ">暂停中</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 休眠中", () => {
    const testRoom = new RoomMock("testRoom");
    testRoom.terminal = new StructureTerminalMock(25, 25);
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [],
      depositTypes: [RESOURCE_MIST],
      sleep: 10,
      sleepReason: "Test"
    };
    Game.time = 0;
    testRoom.terminal.store[RESOURCE_CONCENTRATE] = 1;

    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #c5c599; ">Test 休眠中 剩余10t</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中 统计当前任务信息", () => {
    const testRoom = new RoomMock("testRoom");
    testRoom.terminal = new StructureTerminalMock(25, 25);
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [{ target: RESOURCE_CONCENTRATE, amount: 1000 }],
      depositTypes: [RESOURCE_MIST]
    };
    testRoom.terminal.store[RESOURCE_CONCENTRATE] = 1;
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 1 [任务目标] concentrate*1000 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中 统计当前任务信息 有共享任务", () => {
    const testRoom = new RoomMock("testRoom");
    testRoom.terminal = new StructureTerminalMock(25, 25);
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [{ target: RESOURCE_CONCENTRATE, amount: 1000 }],
      depositTypes: [RESOURCE_MIST]
    };
    Memory.rooms.testRoom.shareTask = { target: "TestTargetRoom", resourceType: RESOURCE_CONCENTRATE, amount: 1000 };
    testRoom.terminal.store[RESOURCE_CONCENTRATE] = 1;
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 1 [任务目标] concentrate*1000 [共享任务] 目标 TestTargetRoom 资源 concentrate 数量 1000 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 未发现终端", () => {
    const testRoom = new RoomMock("testRoom");
    const testRoomMemory = testRoom.memory as RoomMemoryMock;
    testRoomMemory.factory = {
      level: 1,
      targetIndex: 0,
      state: "",
      taskList: [],
      depositTypes: [RESOURCE_MIST]
    };
    assert.equal(
      getRoomFactoryState((testRoom as unknown) as Room),
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 0 异常!未发现终端'
    );
  });
});
