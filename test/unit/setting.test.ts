import { assert } from "chai";
import { bodyConfigs } from "../../src/setting";

describe("setting", () => {
  it("bodyConfigs 存在", () => {
    assert.isDefined(bodyConfigs);
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
        assert.isTrue(energyCost <= Number(energyLevel), `能量花费检查 ${bodyConfigName} ${energyLevel} ${energyCost}`);
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
        assert.isTrue(
          fatigueGenerate <= fatigueDecrease,
          `移动疲劳检查 ${bodyConfigName} ${fatigueGenerate} ${fatigueDecrease}`
        );
      }
    }
  });
});
