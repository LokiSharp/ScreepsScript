import createConst from "@/utils/console/CreateConst";

describe("createConst", () => {
  it("可以生成常量帮助", () => {
    expect(createConst("TestConst", "TestConst Help")).toEqual(
      '<text style="color: #6b9955; ">TestConst</text> <text style="color: #8dc5e3; ">TestConst Help</text>'
    );
  });
});
