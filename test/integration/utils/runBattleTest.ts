/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { getServer } from "../../serverUtils";
import { initBattleTestRoom } from "../init/initBattleTestRoom";
import { setCreep } from "./setCreep";

export async function runBattleTest(): Promise<void> {
  const roomName = "W1N1";
  await initBattleTestRoom();
  const server = await getServer();
  const storage = server.common.storage;
  const { db } = storage;

  const user = server.users[0];
  const target = server.users[1];
  await db["rooms.flags"].insert({ room: roomName, user: user.id, data: "attack~10~10~25~25" });
  await db["rooms.flags"].insert({ room: roomName, user: target.id, data: "attack~10~10~25~25" });

  const userAttacker = await setCreep(
    "attacker",
    [
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 }
    ],
    roomName,
    10,
    10,
    { targetFlagName: "attack" },
    user.id
  );

  const targetAttacker = await setCreep(
    "attacker",
    [
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 }
    ],
    roomName,
    40,
    40,
    { targetFlagName: "attack" },
    target.id
  );

  for (let i = 1; i <= 5000; i += 1) {
    const userAttackerResult = await db["rooms.objects"].findOne({ name: userAttacker.name });
    const targetAttackerResult = await db["rooms.objects"].findOne({ name: targetAttacker.name });
    if (!userAttackerResult || !targetAttackerResult) {
      expect(userAttackerResult).toBeDefined();
      expect(targetAttackerResult).toBeNull();
      break;
    }
    await server.tick();
  }
}
