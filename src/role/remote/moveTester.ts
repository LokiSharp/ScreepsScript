/**
 * 移动测试单位
 *
 * 一直朝着旗帜移动
 * 添加：creepApi.add('happyCreep0', 'moveTester', { wayPoint: 'p' }, 'W49S9')
 * 删除：creepApi.remove('happyCreep')
 */
export default function moveTester(data: RemoteDeclarerData): ICreepConfig {
  return {
    isNeed: () => data.keepSpawn,
    prepare: creep => {
      creep.setWayPoint(data.wayPoint);
      creep.memory.fromShard = Game.shard.name as ShardName;
      creep.memory.logPrePos = data.logPrePos;
      return true;
    },
    target: creep => {
      const result = creep.goTo(undefined, {
        checkTarget: true,
        range: 0
      });
      if (creep.memory.moveInfo) {
        const moveInfo = creep.memory.moveInfo;
        const path = moveInfo ? moveInfo.path || "" : "";
        creep.say(`${result.toString()} ${path}`);
      }

      return false;
    },
    bodys: () => [MOVE]
  };
}
