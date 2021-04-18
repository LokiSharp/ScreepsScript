import { bodyConfigs } from "@/setting";

describe("setting", () => {
  it("bodyConfigs 存在", () => {
    expect(bodyConfigs).toBeDefined();
  });

  it("bodyConfigs 中每个等级的 Body 能量花费是否合理", () => {
    const bypassCheck = ["reserver"];
    for (const bodyConfigName in bodyConfigs) {
      // eslint-disable-next-line no-prototype-builtins
      if (!bodyConfigs.hasOwnProperty(bodyConfigName)) continue;
      if (bypassCheck.includes(bodyConfigName)) {
        continue;
      }
      const bodyConfig = bodyConfigs[bodyConfigName] as BodyConfig;
      for (const energyLevel in bodyConfig) {
        // eslint-disable-next-line no-prototype-builtins
        if (!bodyConfig.hasOwnProperty(energyLevel)) continue;
        const bodyPartConstants = bodyConfig[energyLevel] as BodyPartConstant[];
        let energyCost = 0;
        bodyPartConstants.forEach(bodyPartConstant => (energyCost += BODYPART_COST[bodyPartConstant]));
        expect(energyCost <= Number(energyLevel)).toBeTruthy();
      }
    }
  });

  it("bodyConfigs 中每个等级的 Body 移动疲劳是否合理", () => {
    const bypassCheck = ["harvester"];
    for (const bodyConfigName in bodyConfigs) {
      // eslint-disable-next-line no-prototype-builtins
      if (!bodyConfigs.hasOwnProperty(bodyConfigName)) continue;
      if (bypassCheck.includes(bodyConfigName)) {
        continue;
      }
      const bodyConfig = bodyConfigs[bodyConfigName] as BodyConfig;
      for (const energyLevel in bodyConfig) {
        // eslint-disable-next-line no-prototype-builtins
        if (!bodyConfig.hasOwnProperty(energyLevel)) continue;
        const bodyPartConstants = bodyConfig[energyLevel] as BodyPartConstant[];
        let fatigueGenerate = 0;
        let fatigueDecrease = 0;
        bodyPartConstants.forEach(bodyPartConstant =>
          bodyPartConstant === MOVE
            ? (fatigueDecrease += 2)
            : bodyPartConstant === CARRY
            ? (fatigueGenerate += 0)
            : (fatigueGenerate += 2)
        );
        expect(fatigueGenerate <= fatigueDecrease).toBeTruthy();
      }
    }
  });
});
