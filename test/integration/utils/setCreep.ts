import { getServer } from "./serverUtils";

export async function setCreep(
  role: string,
  body: { type: string; hits: number; boost?: string }[],
  roomName: string,
  x: number,
  y: number,
  data: CreepData,
  userId: string
): Promise<DBRoomObject> {
  const server = await getServer();
  const storage = server.common.storage;
  const creep = await server.world.addRoomObject(roomName, "creep", x, y, {
    body,
    hits: body.reduce((sum, current) => sum + current.hits, 0),
    hitsMax: body.reduce((sum, current) => sum + current.hits, 0),
    name: role + userId + x.toString() + y.toString(),
    user: userId,
    ageTime: 1000
  });

  const userMemory = JSON.parse(await storage.env.get(`memory:${userId}`)) as Memory;

  userMemory.creeps = {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  userMemory.creeps[creep.name] = { role, data };
  await storage.env.set(`memory:${userId}`, JSON.stringify(userMemory));

  return creep;
}
