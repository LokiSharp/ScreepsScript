import { getMock } from "./utils";

// 伪造 visual 的默认值
class VisualMock {
  public line = () => this;
  public circle = () => this;
  public rect = () => this;
  public poly = () => this;
  public text = () => this;
  public clear = () => this;
  public getSize = () => 1;
  public export = () => "export";
  public import = () => this;
}

/**
 * 伪造一个 creep
 * @param props 该 creep 的属性
 */
export const getMockVisual = getMock<RoomVisual>(VisualMock);
