import { getServer, setBaseRoom } from "@test/integration/utils/serverUtils";
import { build } from "@test/integration/utils/moduleUtils";
import { resolve } from "path";

it("内存占用测试", async () => {
  const server = await getServer();
  await setBaseRoom(server);

  const modules = await build(resolve(__dirname, "./main.ts"));
  const bot = await server.world.addBot({ username: "log 测试 a", room: "W0N1", x: 25, y: 25, modules });

  for (let i = 0; i < 2; i++) {
    await server.tick();
  }

  const data = await bot.getSegments([1, 2]);
  console.log("之前", data[1]);
  console.log("之后", data[0]);
});
