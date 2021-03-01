import { assert } from "chai";
import createGetter from "@/utils/global/createGetter";

export class TestObject extends Object {
  public testGetter: boolean;
}

export function TestGetter(): boolean {
  return true;
}

describe("createGetter", () => {
  it("可以挂载访问器", () => {
    assert.isUndefined(((Object as unknown) as TestObject).testGetter);
    createGetter(Object, "testGetter", TestGetter);
    assert.isTrue(((Object as unknown) as TestObject).testGetter);
  });
});
