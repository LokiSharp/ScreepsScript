import { assert } from "chai";
import createLink from "../../../../src/utils/console/createLink";

describe("createLink", () => {
  it("可以生成链接 新标签页打开", () => {
    assert.equal(createLink("TestLinkContent", "TestLink"), '<a href="TestLink" target="_blank">TestLinkContent</a>');
  });

  it("可以生成链接 不在新标签页打开", () => {
    assert.equal(
      createLink("TestLinkContent", "TestLink", false),
      '<a href="TestLink" target="_self">TestLinkContent</a>'
    );
  });
});
