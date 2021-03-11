import { getName } from "@/utils/global/getName";

describe("getName", () => {
  it("基地中心旗帜名", () => {
    const result = getName.flagBaseCenter("TestRoom");
    expect(result).toEqual("TestRoom center");
  });
});
