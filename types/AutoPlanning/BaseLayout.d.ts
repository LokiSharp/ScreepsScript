/**
 * 基地布局信息
 */
type BaseLayout = {
  [structureType in StructureConstant]?: [number, number][] | null;
}[];
