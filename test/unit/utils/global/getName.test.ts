import { assert } from "chai";
import { getName } from "@/utils/global/getName";

describe("getName", () => {
  it("基地中心旗帜名", () => {
    const result = getName.flagBaseCenter("TestRoom");
    assert.equal(result, "TestRoom center");
  });
});
