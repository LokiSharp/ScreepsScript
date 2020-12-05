import BaseMock from "./BaseMock";

export default class ShardMock extends BaseMock implements Shard {
  public constructor(name = "TestShard") {
    super();
    this.name = name;
  }

  public name: string;
  public type: "normal";
  public ptr: boolean;
}
