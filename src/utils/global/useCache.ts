/**
 * 获取指定对象并缓存
 * 会将初始化回调的返回值进行缓存，该返回值 **必须拥有 id 字段**
 *
 * @param initValue 初始化该值的回调，在没有找到缓存 id 时将会调用该方法获取要缓存的初始值
 * @param cachePlace id 存放的对象，一般位于 xxx.memory 上
 * @param cacheKey 要缓存到的键，例如 targetId 之类的字符串
 */
export const useCache = function <T extends ObjectWithId>(
  initValue: () => T,
  cachePlace: AnyObject,
  cacheKey: string
): T {
  const cacheId = cachePlace[cacheKey] as Id<T>;
  let target: T;

  // 如果有缓存了，就读取缓存
  if (cacheId) {
    target = Game.getObjectById(cacheId) as unknown as T;
    // 缓存失效了，移除缓存 id
    if (!target) delete cachePlace[cacheKey];

    return target;
  }

  // 还没有缓存或者缓存失效了，重新获取并缓存
  target = initValue();
  if (target) cachePlace[cacheKey] = target.id;

  return target;
};
