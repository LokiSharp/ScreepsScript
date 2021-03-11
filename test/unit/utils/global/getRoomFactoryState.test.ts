import { getMockRoom } from "@mock/RoomMock";
import { getMockRoomMemory } from "@mock/RoomMemoryMock";
import { getMockStore } from "@mock/StoreMock";
import { getMockStructureTerminal } from "@mock/StructureTerminalMock";
import getRoomFactoryState from "@/utils/global/getRoomFactoryState";
import { refreshGlobalMock } from "@mock/index";

describe("getRoomFactoryState", () => {
  beforeEach(() => {
    refreshGlobalMock();
  });

  it("可以获取工厂状态 工厂未设置等级", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal(),
      memory: getMockRoomMemory()
    });
    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text>工厂未设置等级'
    );
  });

  it("可以获取工厂状态 工厂未设置生产线", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal(),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: []
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text>工厂未设置生产线'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal({ store: getMockStore({ [RESOURCE_CONCENTRATE]: 1 }) }),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [],
          depositTypes: [RESOURCE_MIST]
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 暂停中", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal({ store: getMockStore({ [RESOURCE_CONCENTRATE]: 1 }) }),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [],
          depositTypes: [RESOURCE_MIST],
          pause: true
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #c5c599; ">暂停中</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 休眠中", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal({ store: getMockStore({ [RESOURCE_CONCENTRATE]: 1 }) }),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [],
          depositTypes: [RESOURCE_MIST],
          sleep: 10,
          sleepReason: "Test"
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #c5c599; ">Test 休眠中 剩余10t</text> [当前状态]  [任务数量] 0 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中 统计当前任务信息", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal({ store: getMockStore({ [RESOURCE_CONCENTRATE]: 1 }) }),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [{ target: RESOURCE_CONCENTRATE, amount: 1000 }],
          depositTypes: [RESOURCE_MIST]
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 1 [任务目标] concentrate*1000 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 已设置生产线 工作中 统计当前任务信息 有共享任务", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      terminal: getMockStructureTerminal({ store: getMockStore({ [RESOURCE_CONCENTRATE]: 1 }) }),
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [{ target: RESOURCE_CONCENTRATE, amount: 1000 }],
          depositTypes: [RESOURCE_MIST]
        },
        shareTask: { target: "TestTargetRoom", resourceType: RESOURCE_CONCENTRATE, amount: 1000 }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 1 [任务目标] concentrate*1000 [共享任务] 目标 TestTargetRoom 资源 concentrate 数量 1000 [产物数量] concentrate*1'
    );
  });

  it("可以获取工厂状态 未发现终端", () => {
    const testRoom = getMockRoom({
      name: "testRoom",
      memory: getMockRoomMemory({
        factory: {
          level: 1,
          targetIndex: 0,
          state: "",
          taskList: [],
          depositTypes: [RESOURCE_MIST]
        }
      })
    });

    expect(getRoomFactoryState((testRoom as unknown) as Room)).toEqual(
      '<text style=" font-weight: bolder;">  - [<a href="https://screeps.com/a/#!/room/TestShard/testRoom" target="_self">testRoom</a>] </text><text style="color: #6b9955; ">工作中</text> [当前状态]  [任务数量] 0 异常!未发现终端'
    );
  });
});
