/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IntegrationTestHelper } from "../helper";
import { TerrainMatrix } from "screeps-test-server";
const { readFileSync } = require("fs");

const DIST_MAIN_JS = "dist/main.js";
const DIST_MAIN_JS_MAP = "dist/main.js.map.js";

export async function initBattleTestRoom(helper: IntegrationTestHelper): Promise<void> {
  const terrain = new TerrainMatrix();

  await helper.server.world.addRoom("W0N0");
  await helper.server.world.setTerrain("W0N0", terrain);

  await helper.server.world.addRoom("W0N1");
  await helper.server.world.setTerrain("W0N1", terrain);
  await helper.server.world.addRoomObject("W0N1", "controller", 10, 10, { level: 1 });

  await helper.server.world.addRoom("W0N2");
  await helper.server.world.setTerrain("W0N2", terrain);
  await helper.server.world.addRoomObject("W0N2", "controller", 10, 10, { level: 1 });

  const modules = {
    main: readFileSync(DIST_MAIN_JS).toString(),
    "main.js.map": readFileSync(DIST_MAIN_JS_MAP).toString()
  };
  helper.user = await helper.server.world.addBot({ username: "tester", room: "W0N1", x: 21, y: 26, modules });
  helper.target = await helper.server.world.addBot({ username: "target", room: "W0N2", x: 21, y: 26, modules });
}
