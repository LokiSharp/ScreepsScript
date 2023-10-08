/**
 * 生成通用身体布局获取函数
 *
 * @param bodyConfig 该 creep 对应的身体配置项
 */
export default function createBodyGetter(
  bodyConfig: BodyConfig
): (room: Room, spawn: StructureSpawn) => BodyPartConstant[] {
  /**
   * 获取身体部件数组
   * 根据房间中现存的能量选择给定好的体型
   *
   * @param bodyType
   */
  return function (room: Room, spawn: StructureSpawn): BodyPartConstant[] {
    const targetLevel = Object.keys(bodyConfig)
      .reverse()
      .find(level => {
        // 先通过等级粗略判断，再加上 dryRun 精确验证
        const availableEnergyCheck = Number(level) <= room.energyAvailable;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const dryCheck = spawn.spawnCreep(bodyConfig[level], "bodyTester", { dryRun: true }) === OK;

        return availableEnergyCheck && dryCheck;
      });
    if (!targetLevel) return [];

    // 获取身体部件
    return bodyConfig[targetLevel as EnergyLevel];
  };
}
