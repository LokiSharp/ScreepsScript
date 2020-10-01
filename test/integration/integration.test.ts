/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { EXTENSION_ENERGY_CAPACITY, EXTENSION_HITS } from "./mock";
import { assert } from "chai";
import { helper } from "./helper";
const { readFileSync } = require("fs");
const { TerrainMatrix } = require("screeps-server-mockup");
const DIST_MAIN_JS = "dist/main.js";
const TICK_NUM = 100000;

describe("main", () => {
  it("测试服务器的 tick 是否匹配", async () => {
    for (let i = 1; i < 10; i += 1) {
      assert.equal(await helper.server.world.gameTime, i);
      await helper.server.tick();
    }
  });

  it(`测试 RCL1 -> RCL2`, async () => {
    const RCL = 1;
    const terrain = new TerrainMatrix();
    const walls = [
      [10, 10],
      [10, 40],
      [40, 10],
      [40, 40]
    ];
    _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

    await helper.server.world.addRoom("W0N0");
    await helper.server.world.setTerrain("W0N0", terrain);
    await helper.server.world.addRoomObject("W0N0", "controller", 10, 10, { level: RCL });
    await helper.server.world.addRoomObject("W0N0", "source", 10, 40, {
      energy: 1000,
      energyCapacity: 1000,
      ticksToRegeneration: 300
    });
    await helper.server.world.addRoomObject("W0N0", "mineral", 40, 40, {
      mineralType: "X",
      density: 3,
      mineralAmount: 3000
    });

    const modules = {
      main: readFileSync(DIST_MAIN_JS).toString()
    };
    helper.player = await helper.server.world.addBot({ username: "player", room: "W0N0", x: 15, y: 15, modules });

    for (let i = 1; i < TICK_NUM; i += 1) {
      await helper.server.tick();
      const gameTime: number = await helper.server.world.gameTime;
      if ((gameTime - 1) % 20 === 0) {
        const memory: Memory = JSON.parse(await helper.player.memory);
        console.log("[tick]", gameTime);
        console.log(`[memory] [CPU] ${memory.stats.cpu} [bucket] ${memory.stats.bucket}, \n`);
        console.log(
          `[memory] [RCL%] ${memory.stats.rooms.W0N0.controllerRatio} [RCL] ${memory.stats.rooms.W0N0.controllerLevel}, \n`
        );
        console.log("[structureNums]", memory.stats.rooms.W0N0.structureNums, "\n");

        const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
        if (controllerLevel !== undefined && controllerLevel > RCL) {
          console.log(`RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick`);
          break;
        }
      }

      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
  });

  it(`测试 RCL2 -> RCL3`, async () => {
    const RCL = 2;
    const terrain = new TerrainMatrix();
    const walls = [
      [10, 10],
      [10, 40],
      [40, 10],
      [40, 40]
    ];
    _.each(walls, ([x, y]) => terrain.set(x, y, "wall"));

    await helper.server.world.addRoom("W0N0");
    await helper.server.world.setTerrain("W0N0", terrain);
    await helper.server.world.addRoomObject("W0N0", "controller", 10, 10, { level: RCL });
    await helper.server.world.addRoomObject("W0N0", "source", 10, 40, {
      energy: 1000,
      energyCapacity: 1000,
      ticksToRegeneration: 300
    });
    await helper.server.world.addRoomObject("W0N0", "mineral", 40, 40, {
      mineralType: "X",
      density: 3,
      mineralAmount: 3000
    });

    const modules = {
      main: readFileSync(DIST_MAIN_JS).toString()
    };
    helper.player = await helper.server.world.addBot({ username: "player", room: "W0N0", x: 25, y: 25, modules });
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 28, {
      user: helper.player.id,
      store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: EXTENSION_HITS,
      hitsMax: EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 29, {
      user: helper.player.id,
      store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: EXTENSION_HITS,
      hitsMax: EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 26, 29, {
      user: helper.player.id,
      store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: EXTENSION_HITS,
      hitsMax: EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 24, 29, {
      user: helper.player.id,
      store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: EXTENSION_HITS,
      hitsMax: EXTENSION_HITS
    });
    await helper.server.world.addRoomObject("W0N0", "extension", 25, 30, {
      user: helper.player.id,
      store: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      storeCapacityResource: { energy: EXTENSION_ENERGY_CAPACITY[RCL] },
      hits: EXTENSION_HITS,
      hitsMax: EXTENSION_HITS
    });

    for (let i = 1; i < TICK_NUM; i += 1) {
      await helper.server.tick();
      const gameTime: number = await helper.server.world.gameTime;
      if ((gameTime - 1) % 20 === 0) {
        const memory: Memory = JSON.parse(await helper.player.memory);
        console.log("[tick]", gameTime);
        console.log(`[memory] [CPU] ${memory.stats.cpu} [bucket] ${memory.stats.bucket}, \n`);
        console.log(
          `[memory] [RCL%] ${memory.stats.rooms.W0N0.controllerRatio} [RCL] ${memory.stats.rooms.W0N0.controllerLevel}, \n`
        );
        console.log("[structureNums]", memory.stats.rooms.W0N0.structureNums, "\n");

        const controllerLevel = memory.stats.rooms.W0N0.controllerLevel;
        if (controllerLevel !== undefined && controllerLevel > RCL) {
          console.log(`RCL${RCL} -> RCL${RCL + 1} ${gameTime} tick`);
          break;
        }
      }

      _.each(await helper.player.newNotifications, ({ message }) => console.log("[notification]", message));
    }
  });
});
