/**
 * 签名者
 * 会先抵达指定房间, 然后执行签名
 *
 */
export const signer: CreepConfig<"signer"> = {
  isNeed: () => false,
  target: creep => {
    const { targetRoomName, signText } = creep.memory.data;
    if (
      creep.room.name === targetRoomName &&
      creep.room.controller &&
      (!creep.room.controller.sign ||
        creep.room.controller.sign.text !== signText ||
        creep.room.controller.sign.username !== creep.owner.username)
    ) {
      if (creep.signController(creep.room.controller, signText) === ERR_NOT_IN_RANGE) {
        creep.goTo(creep.room.controller.pos);
      } else creep.log(`目标房间 ${targetRoomName} 签名内容修改为：${signText}`);
    } else creep.goTo(new RoomPosition(25, 25, targetRoomName));

    return false;
  },
  bodys: () => [MOVE]
};
