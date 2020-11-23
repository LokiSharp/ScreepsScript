/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IntegrationTestHelper } from "../helper";

export async function setCreep(
  helper: IntegrationTestHelper,
  role: string,
  body: { type: string; hits: number; boost?: string }[],
  roomName: string,
  x: number,
  y: number,
  data: CreepData,
  userId: string
): Promise<any> {
  const storage = helper.server.common.storage;
  const creep = await helper.server.world.addRoomObject(roomName, "creep", x, y, {
    body,
    hits: body.reduce((sum, current) => sum + current.hits, 0),
    hitsMax: body.reduce((sum, current) => sum + current.hits, 0),
    name: role + userId + x.toString() + y.toString(),
    user: userId,
    ageTime: 1000
  });

  const userMemory = JSON.parse(await storage.env.get(`memory:${userId}`));

  userMemory.creeps = {};
  userMemory.creeps[creep.name] = { role, data };
  await storage.env.set(`memory:${userId}`, JSON.stringify(userMemory));

  return creep;
}
