/**
 * 移动测试单位
 *
 * 一直朝着旗帜移动
 * 添加：creepApi.add('happyCreep0', 'moveTester', { wayPoint: 'p' }, 'W49S9')
 * 删除：creepApi.remove('happyCreep')
 */
export default (data: RemoteDeclarerData): ICreepConfig => ({
  prepare: creep => {
    creep.setWayPoint(data.wayPoint);
    creep.memory.fromShard = Game.shard.name as ShardName;
    return true;
  },
  target: creep => {
    // const cost1 = Game.cpu.getUsed();
    const result = creep.goTo(undefined, {
      checkTarget: true,
      range: 0
    });
    creep.log(`位置 ${creep.memory.prePos}`);
    // creep.log(`移动消耗 ${Game.cpu.getUsed() - cost1}`);
    const moveInfo = creep.memory.moveInfo;
    const path = moveInfo ? moveInfo.path || "" : "";
    creep.say(`${result.toString()} ${path}`);

    return false;
  },
  bodys: [MOVE]
});