import { assert } from "chai";
import { assignPrototype } from "../../../src/utils/prototype";

export class TestPrototypeExtension extends Object {
  public methodIsAssignable(): boolean {
    return true;
  }
  public propertyIsAssignable = true;
}

describe("assignPrototype", () => {
  it("可以挂载方法", () => {
    assignPrototype(Object, TestPrototypeExtension);
    assert.isTrue(Object.methodIsAssignable());
  });
});
