/**
 * 把 obj2 的原型合并到 obj1 的原型上
 * 如果原型的键以 Getter 结尾，则将会把其挂载为 getter 属性
 * @param obj1 要挂载到的对象
 * @param obj2 要进行挂载的对象
 */
export default function assignPrototype(obj1: AnyObject, obj2: AnyObject): void {
  Object.getOwnPropertyNames(obj2.prototype).forEach(key => {
    if (key.includes("Getter")) {
      Object.defineProperty(obj1.prototype, key.split("Getter")[0], {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        get: obj2.prototype[key],
        enumerable: false,
        configurable: true
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    } else obj1.prototype[key] = obj2.prototype[key];
  });
}
