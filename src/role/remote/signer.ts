/**
 * 签名者
 * 会先抵达指定房间, 然后执行签名
 *
 */
export default function signer(data: RemoteDeclarerData): ICreepConfig {
  return {
    isNeed: () => false,
    target: creep => {
      if (
        creep.room.name === data.targetRoomName &&
        creep.room.controller &&
        (!creep.room.controller.sign ||
          creep.room.controller.sign.text !== data.signText ||
          creep.room.controller.sign.username !== creep.owner.username)
      ) {
        if (creep.signController(creep.room.controller, data.signText) === ERR_NOT_IN_RANGE) {
          creep.goTo(creep.room.controller.pos);
        } else creep.log(`目标房间 ${data.targetRoomName} 签名内容修改为：${data.signText}`);
      } else creep.goTo(new RoomPosition(25, 25, data.targetRoomName));

      return false;
    },
    bodys: () => [MOVE]
  };
}
