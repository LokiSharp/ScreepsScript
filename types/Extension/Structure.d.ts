/**
 * 建筑拓展
 */
interface Structure {
  // 是否为自己的建筑，某些建筑不包含此属性，也可以等同于 my = false
  my?: boolean;
  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  log(content: string, color?: Colors, notify?: boolean): void;
  // 建筑的工作方法
  work?(): void;
  // 建筑在完成建造时触发的回调
  onBuildComplete?(): void;
}
