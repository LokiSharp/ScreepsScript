import { BaseMock } from "./BaseMock";
import { getMock } from "@mock/utils";

export class ShardMock extends BaseMock {
  public name = "TestShard";
  public type = "normal";
  public ptr = false;
}

/**
 * 伪造一个 Shard
 * @param props 该属性
 */
export const getMockShard = getMock<Shard>(ShardMock);
