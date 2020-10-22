import { createLink } from "./createLink";

/**
 * 给房间内添加跳转链接
 *
 * @param roomName 添加调整链接的房间名
 * @returns 打印在控制台上后可以点击跳转的房间名
 */
export function createRoomLink(roomName: string): string {
  return createLink(roomName, `https://screeps.com/a/#!/room/${Game.shard.name}/${roomName}`, false);
}
