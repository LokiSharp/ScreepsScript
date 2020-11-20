/**
 * 获取指定键的私有键名
 *
 * @param key 要获取私有键名的键
 */

export function getPrivateKey(key: string): string {
  return `_${key}`;
}
