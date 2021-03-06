import { MapLibrary } from "./types";
import { delayQueue } from "@/modules/delayQueue";

const { addDelayCallback, addDelayTask } = delayQueue;

const RAW_MEMORY_ID = 1;

/**
 * cost 数据储存位置
 * 会在全局重置时从 RawMemory 同步过来
 */
export let mapLibrary: MapLibrary = {};

/**
 * 添加 map 库初始化任务
 */
export function initMapLibrary(): void {
  RawMemory.setActiveSegments([RAW_MEMORY_ID]);
  addDelayTask("mapLibraryInit", { roomName: "" }, Game.time + 1);
}

/**
 * 添加 map 库保存任务
 */
export function saveMapLibrary(): void {
  RawMemory.setActiveSegments([RAW_MEMORY_ID]);
  addDelayTask("mapLibrarySave", { roomName: "" }, Game.time + 1);
}

/**
 * map 库初始化回调
 */
addDelayCallback("mapLibraryInit", () => {
  if (!(RAW_MEMORY_ID in RawMemory.segments)) return initMapLibrary();

  const data = RawMemory.segments[RAW_MEMORY_ID];
  mapLibrary = JSON.parse(data || "{}") as MapLibrary;
});

/**
 * map 库保存回调
 * 由于肯定会经历全量 JSON 压缩，所以这里不用特别指定要保存哪个房间的数据
 */
addDelayCallback("mapLibrarySave", () => {
  if (!(RAW_MEMORY_ID in RawMemory.segments)) return saveMapLibrary();

  // 复制 map 库，只需要保存 raw 原始数据
  const stringifyLibrary: MapLibrary = {};
  for (const roomName in mapLibrary) {
    // eslint-disable-next-line no-prototype-builtins
    if (mapLibrary.hasOwnProperty(roomName)) stringifyLibrary[roomName] = { raw: mapLibrary[roomName].raw };
  }

  RawMemory.segments[RAW_MEMORY_ID] = JSON.stringify(stringifyLibrary);
});
