import { bodyConfigs, creepDefaultMemory, importantRoles } from "setting";
import roles from "role";

/**
 * Spawn 原型拓展
 */
export default class SpawnExtension extends StructureSpawn {
  /**
   * spawn 主要工作
   * @todo 能量不足时挂起任务
   */
  public work(): void {
    if (!this.room.memory.spawnList) this.room.memory.spawnList = [];
    // 生成中 / 生产队列为空 就啥都不干
    if (this.spawning || this.room.memory.spawnList.length === 0) return;

    const task = this.room.memory.spawnList[0];
    // 进行生成
    const spawnResult: MySpawnReturnCode = this.mySpawnCreep(task);

    // 生成成功后移除任务
    if (spawnResult === OK) this.room.memory.spawnList.shift();
    // 能量不足就挂起任务，但是如果是重要角色的话就会卡住然后优先孵化
    else if (spawnResult === ERR_NOT_ENOUGH_ENERGY && !importantRoles.includes(Memory.creepConfigs[task].role))
      this.room.hangSpawnTask();
  }

  /**
   * 从 spawn 生产 creep
   *
   * @param configName 对应的配置名称
   * @returns Spawn.spawnCreep 的返回值
   */
  private mySpawnCreep(configName: string): MySpawnReturnCode {
    // 如果配置列表中已经找不到该 creep 的配置了 则直接移除该生成任务
    const creepConfig = Memory.creepConfigs[configName];

    if (!creepConfig) return OK;
    // 找不到他的工作逻辑的话也直接移除任务
    const creepWork = roles[creepConfig.role](creepConfig.data);
    if (!creepWork) return OK;

    // 设置 creep 内存
    const creepMemory: CreepMemory = _.cloneDeep(creepDefaultMemory);
    creepMemory.role = creepConfig.role;
    creepMemory.data = creepConfig.data;

    // 获取身体部件, 优先使用 bodys
    const bodys =
      typeof creepWork.bodys === "string"
        ? this.getBodys(creepConfig.bodys as BodyAutoConfigConstant)
        : (creepConfig.bodys as BodyPartConstant[]);
    if (bodys.length <= 0) return ERR_NOT_ENOUGH_ENERGY;

    const spawnResult: ScreepsReturnCode = this.spawnCreep(bodys, configName, {
      memory: creepMemory
    });
    // 检查是否生成成功
    if (spawnResult === OK) {
      // this.log(`正在生成 ${configName} ...`)
      return OK;
    } else if (spawnResult === ERR_NAME_EXISTS) {
      this.log(`${configName} 已经存在 ${creepConfig.spawnRoom} 将不再生成 ...`);
      return OK;
    } else {
      // this.log(`生成失败, ${creepConfig.spawnRoom} 任务 ${configName} 挂起, 错误码 ${spawnResult}`, 'red')
      return spawnResult;
    }
  }

  /**
   * 获取身体部件数组
   *
   * @param bodyType creepConfig 中的 bodyType
   */
  private getBodys(bodyType: BodyAutoConfigConstant): BodyPartConstant[] {
    const bodyConfig: BodyConfig = bodyConfigs[bodyType];

    const targetLevel = Object.keys(bodyConfig)
      .reverse()
      .find(level => {
        // 先通过等级粗略判断，再加上 dryRun 精确验证
        const availableEnergyCheck = Number(level) <= this.room.energyAvailable;
        const dryCheck = this.spawnCreep(bodyConfig[level], "bodyTester", { dryRun: true }) === OK;

        return availableEnergyCheck && dryCheck;
      });
    if (!targetLevel) return [];

    // 获取身体部件
    const bodys: BodyPartConstant[] = bodyConfig[targetLevel] as BodyPartConstant[];

    return bodys;
  }
}
