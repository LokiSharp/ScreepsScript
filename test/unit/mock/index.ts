import * as _ from "lodash";
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
import { mockGetObjectById } from "./utils";

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
  getMockStructureTerminal,
  mockGetObjectById
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
  global._ = _;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global._.assign(global, require("@screeps/common/lib/constants"));
}
