/**
 * 给指定对象设置访问器
 *
 * @param target 要设置访问器的对象
 * @param name 访问器的名字
 * @param getter 访问器方法
 */
export const createGetter = function (target: AnyObject, name: string, getter: () => any): void {
  Object.defineProperty(target.prototype, name, {
    get: getter,
    enumerable: false,
    configurable: true
  });
};
