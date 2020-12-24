import RoomTransport, { WORK_PROPORTION_TO_EXPECT } from "../../../../src/modules/RoomTransportTask/RoomTransport";
import CreepMock from "../../mock/CreepMock";
import GameMock from "../../mock/GameMock";
import MemoryMock from "../../mock/MemoryMock";

import { assert } from "chai";

describe("RoomTransportTask", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Game to global
    global.Game = new GameMock();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore : allow adding Memory to global
    global.Memory = new MemoryMock();
  });
  it("RoomTransportTask 可以初始化", () => {
    Memory.rooms.W0N0 = {} as RoomMemory;
    const roomTransport = new RoomTransport("W0N0");
    assert.isDefined(roomTransport);
  });

  it("addTask 可以添加任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    // 添加一个任务
    const taskKey = roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    assert.equal(roomTransport.tasks.length, 1);
    assert.equal(roomTransport.tasks[0].key, taskKey);
    assert.equal(roomTransport.tasks[0].type, "fillExtension");
    // 添加一个其他种类的任务
    roomTransport.addTask({ type: "boostGetResource" }, false, false);
    assert.equal(roomTransport.tasks.length, 2);
    assert.equal(roomTransport.tasks[0].type, "boostGetResource");
    assert.equal(roomTransport.tasks[1].type, "fillExtension");
    // 添加一个相同种类的任务不允许重复
    roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    assert.equal(roomTransport.tasks.length, 2);
    assert.equal(roomTransport.tasks[0].type, "boostGetResource");
    assert.equal(roomTransport.tasks[1].type, "fillExtension");
    // 添加一个相同种类的任务允许重复
    roomTransport.addTask({ type: "boostGetResource", executor: [] }, true, false);
    assert.equal(roomTransport.tasks.length, 3);
    assert.equal(roomTransport.tasks[0].type, "boostGetResource");
    assert.equal(roomTransport.tasks[1].type, "boostGetResource");
    assert.equal(roomTransport.tasks[2].type, "fillExtension");
  });

  it("addTask 可以按优先级添加任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    // 模拟乱序添加多个不同优先级的任务
    const priorities = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].sort(() => Math.random() - 0.5);
    priorities.forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    assert.equal(roomTransport.tasks.length, 11);
    assert.equal(roomTransport.tasks[0].priority, 100);
    assert.equal(roomTransport.tasks[10].priority, 0);
    // 模拟插入一个中间优先级的任务
    roomTransport.addTask({ type: "fillExtension", priority: 55 }, true, false);
    assert.equal(roomTransport.tasks[5].priority, 55);
  });

  it("initTask 可以读取内存中的任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    Memory.rooms.W0N0 = {} as RoomMemory;
    // 模拟从内存还原任务
    Memory.rooms.W0N0.transport = `[{ "type": "fillExtension" }]`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.initTask();
    assert.equal(roomTransport.tasks.length, 1);
    assert.equal(roomTransport.tasks[0].type, "fillExtension");
    // 模拟 Memory.rooms 被删除时时直接 return
    delete Memory.rooms;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.initTask();
    assert.isUndefined(Memory.rooms);

    // 模拟 RoomMemory 被删除时时直接 return
    Memory.rooms = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.initTask();
    assert.isUndefined(Memory.rooms.W0N0);
  });

  it("saveTask 可以保存任务", () => {
    Memory.rooms.W0N0 = {} as RoomMemory;
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension" }, false, false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.saveTask();
    assert.isDefined(Memory.rooms.W0N0.transport);
    assert.isAbove(Memory.rooms.W0N0.transport.length, 0);

    // 模拟 RoomMemory 被删除时创建
    delete Memory.rooms.W0N0;
    assert.isUndefined(Memory.rooms.W0N0);
    Memory.rooms = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.saveTask();
    assert.isDefined(Memory.rooms.W0N0);

    // 模拟 Memory.rooms 被删除时创建
    delete Memory.rooms;
    assert.isUndefined(Memory.rooms);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.saveTask();
    assert.isDefined(Memory.rooms);
  });

  it("getTask 可以获取任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    const taskKey = roomTransport.addTask({ type: "fillExtension" }, false, false);
    assert.equal(roomTransport.getTask(taskKey).type, "fillExtension");
    assert.isUndefined(roomTransport.getTask(undefined));
  });

  it("hasTask 可以检查是否有任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    assert.isFalse(roomTransport.hasTask("fillExtension"));
    roomTransport.addTask({ type: "fillExtension" }, false, false);
    assert.isTrue(roomTransport.hasTask("fillExtension"));
  });

  it("removeTask 可以移除任务", () => {
    const creepsSet = [...new Array(4).keys()].map(num => {
      const creep = (new CreepMock(`creepOne${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = {} as CreepMemory<"manager">;
      return creep;
    });
    creepsSet.forEach(creep => {
      Game.creeps[creep.id] = creep;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line deprecation/deprecation
    Game.getObjectById = function (id: string): Creep<"manager"> {
      return Game.creeps[id] as Creep<"manager">;
    };

    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "boostGetResource" }, true, false);
    const taskKey = roomTransport.addTask({ type: "fillExtension" }, true, false);
    roomTransport.addTask({ type: "boostGetResource" }, true, false);
    roomTransport.addTask({ type: "fillExtension" }, true, false);
    assert.equal(roomTransport.tasks.length, 4);
    assert.equal(roomTransport.removeTask(taskKey), OK);
    assert.equal(roomTransport.tasks.length, 3);
    assert.equal(roomTransport.removeTask(taskKey), OK);
    assert.equal(roomTransport.tasks.length, 3);
    const taskKey2 = roomTransport.addTask({ type: "fillExtension" }, true, false);
    assert.equal(roomTransport.tasks.length, 4);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line deprecation/deprecation
    Game.getObjectById = function (id: string): Creep<"manager"> {
      creepsSet.find(creep => creep.id === id);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);

    assert.equal(roomTransport.removeTask(taskKey2), OK);
    assert.equal(roomTransport.tasks.length, 3);
  });

  it("giveTask 可以给指定 creep 分配任务", () => {
    Memory.rooms.W0N0 = {} as RoomMemory;
    const TestCreep1 = (new CreepMock(`TestCreep1` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
    TestCreep1.memory = {} as CreepMemory<"manager">;

    const roomTransport = new RoomTransport("W0N0");
    const taskKey = roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    RoomTransport.giveTask(TestCreep1, roomTransport.getTask(taskKey));
    assert.equal(roomTransport.getTask(taskKey).executor[0], TestCreep1.id);
    assert.equal(TestCreep1.memory.transportTaskKey, taskKey);
  });

  it("giveJob 可以给 creep 分配任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    // 创建 10 个任务
    [...new Array(10).keys()].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // 模拟分配任务给 10 个 Creep
    const creepsSetOne = [...new Array(10).keys()].map(num => {
      const creep = (new CreepMock(`creepOne${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = { transportTaskKey: 0 } as CreepMemory<"manager">;
      return creep;
    });
    // 检验是否每个任务都有 1 个 Creep
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSetOne);
    for (const task of roomTransport.tasks) {
      assert.equal(task.executor.length, 1);
    }
    // 模拟分配任务给另外 10 个 Creep
    const creepsSetTwo = [...new Array(10).keys()].map(num => {
      const creep = (new CreepMock(`creepTwo${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = { transportTaskKey: 0 } as CreepMemory<"manager">;
      return creep;
    });
    // 检验是否每个任务都有 2 个 Creep
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSetTwo);
    for (const task of roomTransport.tasks) {
      assert.equal(task.executor.length, 2);
    }
  });

  it("getExpect 获取当前的搬运工调整期望", () => {
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.totalLifeTime = 500;
    roomTransport.totalWorkTime = roomTransport.totalLifeTime * 0.9;
    assert.equal(roomTransport.getExpect(), 2);
    (WORK_PROPORTION_TO_EXPECT as { proportion: number; expect: number }[]).forEach(item => {
      roomTransport.totalWorkTime = roomTransport.totalLifeTime * item.proportion;
      assert.equal(roomTransport.getExpect(), item.expect);
    });
    roomTransport.totalLifeTime = 300;
    assert.equal(roomTransport.getExpect(), 0);
    roomTransport.totalLifeTime = 500;
    roomTransport.totalWorkTime = -100;
    assert.equal(roomTransport.getExpect(), -2);
  });

  it("dispatchTask 给当前现存的任务按照优先级重新分配 creep", () => {
    const creepsSet = [...new Array(5).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = {} as CreepMemory<"manager">;
      return creep;
    });
    // creepsSet 的浅拷贝
    const creepShallowCopySet: Creep[] = [];
    Object.assign(creepShallowCopySet, creepsSet);
    creepsSet.forEach(creep => {
      Game.creeps[creep.id] = creep;
    });
    assert.sameMembers(creepShallowCopySet, creepsSet);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line deprecation/deprecation
    Game.getObjectById = function (id: string): Creep<"manager"> {
      return Game.creeps[id] as Creep<"manager">;
    };

    const roomTransport = new RoomTransport("W0N0");
    [50, 40, 30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // 检验是否每个任务都有 1 个 Creep
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepShallowCopySet);
    Object.assign(creepShallowCopySet, creepsSet);

    for (const task of roomTransport.tasks) {
      assert.equal(task.executor.length, 1);
    }
    [100, 90, 80, 70, 60].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.dispatchTask();
    for (let i = 0; i < 5; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 1);
    }

    for (let i = 5; i < 10; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
  });
  it("taskExecutorFilter 可以过滤已经不存在的任务执行者", () => {
    const creepsSet = [...new Array(5).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = {} as CreepMemory<"manager">;
      return creep;
    });
    // creepsSet 的浅拷贝
    const creepShallowCopySet: Creep[] = [];
    Object.assign(creepShallowCopySet, creepsSet);
    creepsSet.forEach(creep => {
      Game.creeps[creep.id] = creep;
    });
    assert.sameMembers(creepShallowCopySet, creepsSet);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line deprecation/deprecation
    Game.getObjectById = function (id: string): Creep<"manager"> {
      return Game.creeps[id] as Creep<"manager">;
    };
    const roomTransport = new RoomTransport("W0N0");
    [50, 40, 30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepShallowCopySet);
    delete Game.creeps.creep1;
    delete Game.creeps.creep3;
    for (let i = 0; i < roomTransport.tasks.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      roomTransport.taskExecutorFilter(i);

      assert.equal(roomTransport.tasks[i].executor.length, [1, 0, 1, 0, 1][i]);
    }
  });
});
