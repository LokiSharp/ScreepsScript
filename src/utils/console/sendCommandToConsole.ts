/**
 * 创建发送函数到控制台的调用链
 *
 * @see https://screeps.slack.com/files/U5GS01HT8/FJGTY8VQE/console_button.php
 * @param command 要在游戏控制台执行的方法
 */
export function sendCommandToConsole(command: string): string {
  return `angular.element(document.body).injector().get('Console').sendCommand('(${command})()', 1)`;
}
