import { getMockCPU } from "./CPUMock";
import { getMockCreep } from "./CreepMock";
import { getMockFlag } from "./FlagMock";
import { getMockGame } from "./GameMock";
import { getMockMarket } from "./MarketMock";
import { getMockMemory } from "./MemoryMock";
import { getMockRoom } from "./RoomMock";
import { getMockRoomObject } from "./RoomObjectMock";
import { getMockRoomPosition } from "./RoomPositionMock";
import { getMockShard } from "./ShardMock";
import { getMockStore } from "./StoreMock";
import { getMockStructureController } from "./StructureControllerMock";
import { getMockStructureSpawn } from "./StructureSpawnMock";
import { getMockStructureTerminal } from "./StructureTerminalMock";
import { spy } from "sinon";

export {
  getMockCPU,
  getMockCreep,
  getMockFlag,
  getMockGame,
  getMockMarket,
  getMockMemory,
  getMockRoom,
  getMockRoomObject,
  getMockRoomPosition,
  getMockShard,
  getMockStore,
  getMockStructureController,
  getMockStructureSpawn,
  getMockStructureTerminal
};
/**
 * 刷新游戏环境
 * 将 global 改造成类似游戏中的环境
 */
export function refreshGlobalMock(): void {
  global.Game = getMockGame();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore : allow adding Memory to global
  global.Memory = getMockMemory();
}

/**
 * 创建 Game.getObjectById
 * @param items 用于搜索的对象数组，每个对象都应包含 id
 */
export function mockGetObjectById(items: ObjectWithId[]): any {
  // eslint-disable-next-line deprecation/deprecation
  return (Game.getObjectById = spy((id: string) => items.find(item => item.id === id)));
}
