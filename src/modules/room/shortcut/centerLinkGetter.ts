import { getStructureWithMemory } from "./getStructureWithMemory";

/**
 * 中央 link 访问器
 */
export function centerLinkGetter(): StructureLink {
  return getStructureWithMemory<StructureLink>(this, "centerLinkCache", "centerLinkId");
}
