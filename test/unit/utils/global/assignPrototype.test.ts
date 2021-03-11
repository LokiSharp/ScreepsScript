import assignPrototype from "@/utils/global/assignPrototype";

export class TestPrototypeExtension extends Object {
  public methodIsAssignable(): boolean {
    return true;
  }

  public getterIsAssignableGetter(): boolean {
    return true;
  }

  public propertyIsAssignable = true;
}

describe("assignPrototype", () => {
  it("可以挂载方法", () => {
    assignPrototype(Object, TestPrototypeExtension);
    expect(Object.methodIsAssignable()).toBeTruthy();
    expect(Object.getterIsAssignable).toBeTruthy();
  });
});
