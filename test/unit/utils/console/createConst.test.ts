import { assert } from "chai";
import createConst from "../../../../src/utils/console/createConst";

describe("createConst", () => {
  it("可以生成常量帮助", () => {
    assert.equal(
      createConst("TestConst", "TestConst Help"),
      '<text style="color: #6b9955; ">TestConst</text> <text style="color: #8dc5e3; ">TestConst Help</text>'
    );
  });
});
