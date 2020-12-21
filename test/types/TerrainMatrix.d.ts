declare type TerrainType = "plain" | "wall" | "swamp";
declare class TerrainMatrix {
  private data;
  public constructor();
  public get(x: number, y: number): TerrainType;
  public set(x: number, y: number, value: TerrainType): TerrainMatrix;
  /**
   * 序列化地形
   */
  public serialize(): string;
  /**
   * 反序列化地形
   */
  public static unserialize(str: string): TerrainMatrix;
}
