import RoomTransport, {
  WORK_PROPORTION_TO_EXPECT
} from "../../../../../src/modules/Task/RoomTransportTask/RoomTransport";
import CreepMock from "../../../mock/CreepMock";
import GameMock from "../../../mock/GameMock";
import MemoryMock from "../../../mock/MemoryMock";
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
  });

  it("addTask 可以添加任务时禁用重分配", () => {
    const roomTransport = new RoomTransport("W0N0");
    // 添加一个任务
    const taskKey = roomTransport.addTask({ type: "fillExtension", executor: [] });
    assert.equal(roomTransport.tasks.length, 1);
    assert.equal(roomTransport.tasks[0].key, taskKey);
    assert.equal(roomTransport.tasks[0].type, "fillExtension");
  });

  it("addTask 可以添加两个不同种类的任务", () => {
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    roomTransport.addTask({ type: "boostGetResource" }, false, false);
    assert.equal(roomTransport.tasks.length, 2);
    assert.equal(roomTransport.tasks[0].type, "boostGetResource");
    assert.equal(roomTransport.tasks[1].type, "fillExtension");
  });

  it("addTask 可以添加相同种类的任务不允许重复", () => {
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    roomTransport.addTask({ type: "boostGetResource" }, false, false);
    roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    assert.equal(roomTransport.tasks.length, 2);
    assert.equal(roomTransport.tasks[0].type, "boostGetResource");
    assert.equal(roomTransport.tasks[1].type, "fillExtension");
  });

  it("addTask 可以添加相同种类的任务允许重复", () => {
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    roomTransport.addTask({ type: "boostGetResource" }, false, false);
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
    Memory.rooms.W0N0.transportTasks = `[{ "type": "fillExtension" }]`;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.initTask();
    assert.equal(roomTransport.tasks.length, 1);
    assert.equal(roomTransport.tasks[0].type, "fillExtension");
  });

  it("initTask 可以在 Memory.rooms 不存在时直接 return", () => {
    const roomTransport = new RoomTransport("W0N0");
    delete Memory.rooms;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.initTask();
    assert.isUndefined(Memory.rooms);
  });

  it("initTask 可以在 Memory.rooms[RoomName] 不存在时直接 return", () => {
    const roomTransport = new RoomTransport("W0N0");
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
    assert.isDefined(Memory.rooms.W0N0.transportTasks);
    assert.isAbove(Memory.rooms.W0N0.transportTasks.length, 0);
  });

  it("saveTask 可以 Memory.rooms 不存在时创建", () => {
    const roomTransport = new RoomTransport("W0N0");
    delete Memory.rooms;
    // 模拟 Memory.rooms 被删除时创建
    assert.isUndefined(Memory.rooms);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.saveTask();
    assert.isDefined(Memory.rooms);
  });

  it("saveTask 可以 Memory.rooms[RoomName] 不存在时创建", () => {
    const roomTransport = new RoomTransport("W0N0");
    // 模拟 RoomMemory 被删除时创建
    assert.isUndefined(Memory.rooms.W0N0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.saveTask();
    assert.isDefined(Memory.rooms.W0N0);
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
    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "boostGetResource" }, true, false);
    const taskKey = roomTransport.addTask({ type: "fillExtension" }, true, false);
    roomTransport.addTask({ type: "boostGetResource" }, true, false);
    roomTransport.addTask({ type: "fillExtension" }, true, false);
    assert.equal(roomTransport.tasks.length, 4);
    // 删除一个任务
    assert.equal(roomTransport.removeTask(taskKey), OK);
    assert.equal(roomTransport.tasks.length, 3);
    // 重复删除同一个任务
    assert.equal(roomTransport.removeTask(taskKey), OK);
    assert.equal(roomTransport.tasks.length, 3);
  });

  it("removeTask 可以移除任务后给队列中的 creep 分配任务", () => {
    const creepsSet = [...new Array(4).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
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
    const taskKey = roomTransport.addTask({ type: "fillExtension" }, true, false);
    roomTransport.addTask({ type: "fillExtension" }, true, false);
    assert.equal(roomTransport.tasks.length, 2);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);
    assert.equal(roomTransport.tasks[0].executor.length, 2);
    assert.equal(roomTransport.tasks[1].executor.length, 2);

    assert.equal(roomTransport.removeTask(taskKey), OK);
    assert.equal(roomTransport.tasks.length, 1);
    assert.equal(roomTransport.tasks[0].executor.length, 4);
  });

  it("giveTask 可以给指定 creep 分配任务", () => {
    Memory.rooms.W0N0 = {} as RoomMemory;
    const Creep = (new CreepMock(`Creep` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
    Creep.memory = {} as CreepMemory<"manager">;

    const roomTransport = new RoomTransport("W0N0");
    const taskKey = roomTransport.addTask({ type: "fillExtension", executor: [] }, false, false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    RoomTransport.giveTask(Creep, roomTransport.getTask(taskKey));
    assert.equal(roomTransport.getTask(taskKey).executor[0], Creep.id);
    assert.equal(Creep.memory.transportTaskKey, taskKey);
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

  it("dispatchTask 可以给当前现存的任务按照优先级重新分配 creep", () => {
    const creepsSet = [...new Array(5).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
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
    // 添加 5 个低优先级任务
    const roomTransport = new RoomTransport("W0N0");
    [50, 40, 30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);
    // 检验是否每个低优先级任务都有 1 个执行者
    for (const task of roomTransport.tasks) {
      assert.equal(task.executor.length, 1);
    }
    // 添加 5 个高优先级任务
    [100, 90, 80, 70, 60].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.dispatchTask();
    // 检验是否每个高优先级任务都有 1 个执行者
    for (let i = 0; i < 5; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 1);
    }
    // 检验是否每个低优先级任务没有执行者
    for (let i = 5; i < 10; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
  });

  it("dispatchTask 可以在分配跳过满足要求的任务", () => {
    const creepsSet = [...new Array(2).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
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
    // 添加 5 个任务
    const roomTransport = new RoomTransport("W0N0");
    [50, 40, 30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);
    // 检验是否每个高优先级任务都有 1 个执行者
    for (let i = 0; i < 2; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 1);
    }
    // 检验是否每个低优先级任务没有执行者
    for (let i = 2; i < 5; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.dispatchTask();
    // 检验是否每个高优先级任务都有 1 个执行者
    for (let i = 0; i < 2; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 1);
    }
    // 检验是否每个低优先级任务没有执行者
    for (let i = 2; i < 5; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
  });

  it("dispatchTask 可以在找不到 Creep 时跳过", () => {
    const creepsSet = [...new Array(6).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
      creep.memory = {} as CreepMemory<"manager">;
      return creep;
    });
    creepsSet.forEach(creep => {
      Game.creeps[creep.id] = creep;
    });
    delete Game.creeps.creep5;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line deprecation/deprecation
    Game.getObjectById = function (id: string): Creep<"manager"> {
      return Game.creeps[id] as Creep<"manager">;
    };

    const roomTransport = new RoomTransport("W0N0");
    // 添加 3 个低优先级任务
    [30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);
    // 添加 3 个高优先级任务
    [60, 50, 40].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // 检验是否每个高优先级任务都没有执行者
    for (let i = 0; i < 3; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
    // 检验是否每个高优先级任务都有 2 个执行者
    for (let i = 3; i < 6; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 2);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.dispatchTask();
    // 检验是否前五个高优先级任务都有 1 个执行者
    for (let i = 0; i < 5; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 1);
    }

    // 检验是否最后一个低优先级任务没有执行者
    for (let i = 5; i < 6; i++) {
      assert.equal(roomTransport.tasks[i].executor.length, 0);
    }
  });

  it("taskExecutorFilter 可以过滤已经不存在的任务执行者", () => {
    const creepsSet = [...new Array(5).keys()].map(num => {
      const creep = (new CreepMock(`creep${num}` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
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
    [50, 40, 30, 20, 10].forEach(priority => {
      roomTransport.addTask({ type: "fillExtension", priority }, true, false);
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob(creepsSet);
    delete Game.creeps.creep1;
    delete Game.creeps.creep3;
    for (let i = 0; i < roomTransport.tasks.length; i++) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      roomTransport.taskExecutorFilter(i);

      assert.equal(roomTransport.tasks[i].executor.length, [1, 0, 1, 0, 1][i]);
    }
  });

  it("getWork 可以在执行者有任务时获取任务工作，并修改生存时间和工作时间", () => {
    const creep = (new CreepMock(`creep` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
    creep.memory = {} as CreepMemory<"manager">;

    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension" }, true, false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    roomTransport.giveJob([creep]);
    const work = roomTransport.getWork(creep);
    assert.isDefined(work);
    assert.equal(roomTransport.totalWorkTime, 1);
    assert.equal(roomTransport.totalLifeTime, 1);
  });

  it("getWork 可以在执行者和队列均无任务时获取空工作，并修改生存时间", () => {
    const creep = (new CreepMock(`creep` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
    creep.memory = {} as CreepMemory<"manager">;

    const roomTransport = new RoomTransport("W0N0");

    const work = roomTransport.getWork(creep);
    assert.isDefined(work);
    assert.equal(roomTransport.totalWorkTime, 0);
    assert.equal(roomTransport.totalLifeTime, 1);
  });

  it("getWork 可以在执行者无任务和队列有任务时分配工作获取任务工作，并修改生存时间和工作时间", () => {
    const creep = (new CreepMock(`creep` as Id<CreepMock>, 0, 0) as unknown) as Creep<"manager">;
    creep.memory = {} as CreepMemory<"manager">;

    const roomTransport = new RoomTransport("W0N0");
    roomTransport.addTask({ type: "fillExtension" }, true, false);

    const work = roomTransport.getWork(creep);
    assert.isDefined(work);
    assert.equal(roomTransport.totalWorkTime, 1);
    assert.equal(roomTransport.totalLifeTime, 1);
  });
});
