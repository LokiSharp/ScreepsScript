import colorful, { colors } from "@/utils/console/colorful";

describe("colorful", () => {
  it("可以添加颜色", () => {
    const colorNames = ["green", "blue", "yellow", "red"] as Colors[];
    colorNames.forEach(colorName =>
      expect(colorful("TestString", colorName)).toEqual(`<text style="color: ${colors[colorName]}; ">TestString</text>`)
    );
  });

  it("可以加粗", () => {
    expect(colorful("TestString", null, true)).toEqual(`<text style=" font-weight: bolder;">TestString</text>`);
  });

  it("可以添加颜色同时加粗", () => {
    const colorNames = ["green", "blue", "yellow", "red"] as Colors[];
    colorNames.forEach(colorName =>
      expect(colorful("TestString", colorName, true)).toEqual(
        `<text style="color: ${colors[colorName]}; font-weight: bolder;">TestString</text>`
      )
    );
  });

  it("参数仅有 content 时", () => {
    expect(colorful("TestString")).toEqual(`<text style=" ">TestString</text>`);
  });
});
