import createGetter from "@/utils/global/createGetter";

export class TestObject extends Object {
  public testGetter: boolean;
}

export function TestGetter(): boolean {
  return true;
}

describe("createGetter", () => {
  it("可以挂载访问器", () => {
    expect(((Object as unknown) as TestObject).testGetter).not.toBeDefined();
    createGetter(Object, "testGetter", TestGetter);
    expect(((Object as unknown) as TestObject).testGetter).toBeTruthy();
  });
});
