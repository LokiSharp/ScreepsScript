import { calcBodyPart } from "./calcBodyPart";

/**
 * 快速生成 creep 身体部件配置项
 *
 * @param bodySets 1 - 8 级时对应的身体部件配置
 */
export const getBodyConfig = function (bodySets: BodySets): BodyConfig {
  const config: BodyConfig = { 300: [], 550: [], 800: [], 1300: [], 1800: [], 2300: [], 5600: [], 10000: [] };
  // 遍历空配置项，用传入的 bodySet 依次生成配置项
  Object.keys(config).map((level, index) => {
    config[level] = calcBodyPart(bodySets[index]);
  });

  return config;
};
