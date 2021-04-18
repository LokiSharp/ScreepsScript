/**
 * 包含任意键值对的类
 */
interface AnyClass {
  new (): any;
  [key: string]: any;
}

/**
 * 快捷生成游戏对象创建函数
 *
 * @param MockClass 伪造的基础游戏类
 * @returns 一个函数，可以指定要生成类的任意属性
 */
export const getMock = function <T>(MockClass: AnyClass): (props?: Partial<T>) => T {
  return (props = {}) => Object.assign(new MockClass() as T, props);
};

/**
 * 创建 Game.getObjectById
 * @param items 用于搜索的对象数组，每个对象都应包含 id
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const mockGetObjectById = function (items: ObjectWithId[]) {
  // eslint-disable-next-line deprecation/deprecation
  return (Game.getObjectById = jest.fn((id: string) => items.find(item => item.id === id)));
};
