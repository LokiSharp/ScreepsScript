import { runBattleTest } from "./utils/runBattleTest";

describe("战斗场景", () => {
  it("Attacker * 1 vs Attacker * 1", async () => {
    await runBattleTest();
  });
});
