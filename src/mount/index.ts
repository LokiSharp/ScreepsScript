import {
  ContainerExtension,
  ControllerExtension,
  ExtractorExtension,
  FactoryConsole,
  FactoryExtension,
  FactoryHelp,
  LabExtension,
  LinkExtension,
  LinkHelp,
  NukerExtension,
  ObserverConsole,
  ObserverExtension,
  ObserverHelp,
  PowerSpawnConsole,
  PowerSpawnExtension,
  PowerSpawnHelp,
  SourceExtension,
  SpawnExtension,
  StorageConsole,
  StorageExtension,
  StructureExtension,
  TerminalConsole,
  TerminalExtension,
  TerminalHelp,
  TowerExtension
} from "./StructureExtension";

import { PowerCreepExtension, mountPowerToRoom } from "./PowerCreepExtension";
import mountCreep, { CreepExtension } from "./CreepExtension";
import mountRoom, { RoomConsole, RoomExtension, RoomHelp } from "./RoomExtension";
import { RoomPostionExtension } from "./RoomPostionExtension";
import log from "@/utils/console/log";
import mountGlobal from "./GlobalExtension";
import { setBornCenter } from "@/modules/autoPlanning/planBasePos";

/**
 * 所有需要挂载的原型拓展
 */
export const mountList: [AnyClass, AnyClass][] = [
  [Room, RoomExtension],
  [Room, RoomConsole],
  [Room, RoomHelp],
  [RoomPosition, RoomPostionExtension],
  [Creep, CreepExtension],
  [PowerCreep, PowerCreepExtension],
  [Source, SourceExtension],
  [Structure, StructureExtension],
  [StructureContainer, ContainerExtension],
  [StructureController, ControllerExtension],
  [StructureSpawn, SpawnExtension],
  [StructureTower, TowerExtension],
  [StructureLink, LinkExtension],
  [StructureLink, LinkHelp],
  [StructureFactory, FactoryExtension],
  [StructureFactory, FactoryConsole],
  [StructureFactory, FactoryHelp],
  [StructureTerminal, TerminalExtension],
  [StructureTerminal, TerminalConsole],
  [StructureTerminal, TerminalHelp],
  [StructureExtractor, ExtractorExtension],
  [StructureStorage, StorageExtension],
  [StructureStorage, StorageConsole],
  [StructureLab, LabExtension],
  [StructureNuker, NukerExtension],
  [StructurePowerSpawn, PowerSpawnExtension],
  [StructurePowerSpawn, PowerSpawnConsole],
  [StructurePowerSpawn, PowerSpawnHelp],
  [StructureObserver, ObserverExtension],
  [StructureObserver, ObserverConsole],
  [StructureObserver, ObserverHelp]
];

/**
 * 初始化存储
 */
function initStorage() {
  if (!Memory.rooms) Memory.rooms = {};
  else delete Memory.rooms.undefined;

  if (!Memory.resourceSourceMap) Memory.resourceSourceMap = {};
}

/**
 * 主要拓展注册插件
 */
export const extensionAppPlugin: AppLifecycleCallbacks = {
  born: () => {
    const spawns: StructureSpawn[] = Object.values(Game.spawns);
    if (spawns.length > 1) return;

    log("欢迎来到 Screeps 的世界!\n", ["LokiSharp bot"], "green");
    // 设置中心点位并执行初始化配置
    setBornCenter(spawns[0]);
    spawns[0].room.controller.onLevelChange(1);
    spawns[0].room.controller.stateScanner();
  },

  reset: () => {
    log("重新挂载拓展", ["global"], "green");

    // 存储的兜底工作
    initStorage();

    // 挂载全部拓展
    mountGlobal();
    mountRoom();
    mountCreep();

    // 挂载 power 能力
    mountPowerToRoom();
  }
};
