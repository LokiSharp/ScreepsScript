import LinkExtension from "./LinkExtension";
import { createHelp } from "@/modules/help";

export class LinkHelp extends LinkExtension {
  /**
   * 用户操作: 帮助
   */
  public help(): string {
    return createHelp({
      name: "Link 控制台",
      describe:
        "一般情况下不会用到下面的接口，link 在建好后会自动决定职责，如果你觉得职责不合适，就可以使用下面接口手动修改职责",
      api: [
        {
          title: "注册为源 link",
          functionName: "asSource"
        },
        {
          title: "注册为中央 link",
          functionName: "asCenter"
        },
        {
          title: "注册为升级 link",
          functionName: "asUpgrade"
        }
      ]
    });
  }
}
