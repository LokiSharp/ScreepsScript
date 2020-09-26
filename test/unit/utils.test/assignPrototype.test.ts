import { assert } from "chai";
import { assignPrototype } from "../../../src/utils/prototype";

// eslint-disable-next-line id-blacklist
export class TestPrototypeExtension extends Object {
  public methodIsAssignable(): boolean {
    return true;
  }
  public propertyIsAssignable = true;
}

describe("assignPrototype", () => {
  it("可以挂载方法", () => {
    assignPrototype(Object, TestPrototypeExtension);
    // eslint-disable-next-line id-blacklist
    assert.isTrue(Object.methodIsAssignable());
  });
});
