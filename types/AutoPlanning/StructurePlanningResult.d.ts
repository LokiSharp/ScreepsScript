/**
 * 建筑规划结果
 *
 * 每种建筑（键）都对应一个建筑位置二维数组（值）
 * 后面的二维数组第一层代表 RCL 等级，第二层包含了该 RCL 时应该建造的位置信息
 */
type StructurePlanningResult = {
  [structureType in BuildableStructureConstant]?: RoomPosition[] | null;
}[];
