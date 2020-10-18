/**
 * 移动测试单位
 *
 * 一直朝着旗帜移动
 * 添加：creepApi.add('happyCreep0', 'moveTester', { sourceFlagName: 'p' }, 'W49S9')
 * 删除：creepApi.remove('happyCreep')
 */
export default (data: RemoteHarvesterData): ICreepConfig => ({
  prepare: creep => {
    creep.setWayPoint(data.sourceFlagName);
    creep.memory.fromShard = Game.shard.name as ShardName;
    return true;
  },
  target: creep => {
    const cost1 = Game.cpu.getUsed();
    const result = creep.goTo(undefined, {
      checkTarget: true,
      range: 0
    });
    creep.log(`移动消耗 ${Game.cpu.getUsed() - cost1}`);
    // eslint-disable-next-line no-underscore-dangle
    const _go = creep.memory._go;
    const path = _go ? _go.path || "" : "";
    creep.say(`${result.toString()} ${path}`);

    return false;
  },
  bodys: [MOVE]
});
