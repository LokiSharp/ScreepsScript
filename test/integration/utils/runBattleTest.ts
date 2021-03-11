/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { helper } from "../helper";
import { initBattleTestRoom } from "../init/initBattleTestRoom";
import { setCreep } from "./setCreep";

export async function runBattleTest(): Promise<void> {
  await initBattleTestRoom(helper);
  const storage = helper.server.common.storage;
  const { db } = storage;

  await db["rooms.flags"].insert({ room: "W0N0", user: helper.user.id, data: "attack~10~10~40~40" });
  await db["rooms.flags"].insert({ room: "W0N0", user: helper.target.id, data: "attack~10~10~10~10" });

  const userAttacker = await setCreep(
    helper,
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
    "W0N0",
    10,
    10,
    { targetFlagName: "attack" },
    helper.user.id
  );

  const targetAttacker = await setCreep(
    helper,
    "attacker",
    [
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 },
      { type: ATTACK, hits: 100 },
      { type: MOVE, hits: 100 }
    ],
    "W0N0",
    40,
    40,
    { targetFlagName: "attack" },
    helper.target.id
  );

  for (let i = 1; i <= 5000; i += 1) {
    const userAttackerResult = await db["rooms.objects"].findOne({ name: userAttacker.name });
    const targetAttackerResult = await db["rooms.objects"].findOne({ name: targetAttacker.name });
    if (!userAttackerResult || !targetAttackerResult) {
      expect(userAttackerResult).toBeDefined();
      expect(targetAttackerResult).toBeNull();
      break;
    }
    await helper.server.tick();
  }
}
