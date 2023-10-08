import { getStructureWithMemory } from "./getStructureWithMemory";

/**
 * 中央 link 访问器
 */
export function centerLinkGetter(): StructureLink {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return getStructureWithMemory<StructureLink>(this, "centerLinkCache", "centerLinkId");
}
