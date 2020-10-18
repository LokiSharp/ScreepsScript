/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { baseLayout } from "setting";
import { creepApi } from "modules/creepController";
import { findBaseCenterPos } from "modules/autoPlanning/planBasePos";

// 全局拓展对象
export default {
  /**
   * Game.getObjectById 的别名
   *
   * @param id 游戏对象的 id
   */
  get(id: string): RoomObject {
    return Game.getObjectById(id as Id<RoomObject>);
  },

  /**
   * Game.market.extendOrder 的别名
   *
   * @param orderId 订单的 id
   * @param amount 要追加的数量
   */
  orderExtend(orderId: string, amount: number): string {
    const actionResult = Game.market.extendOrder(orderId, amount);

    let returnString = "";
    if (actionResult === OK) returnString = "订单追加成功";
    else returnString = `订单追加失败，错误码 ${returnString}`;

    return returnString;
  },

  /**
   * 查询指定资源在各个房间中的数量
   *
   * @param resourceName 要查询的资源名
   */
  seeres(resourceName: ResourceConstant): string {
    // 根据资源不同选择不同的查询目标
    const source = resourceName === RESOURCE_ENERGY ? STRUCTURE_STORAGE : STRUCTURE_TERMINAL;
    let total = 0;

    let log = `${resourceName} 的分布如下：\n`;
    // 遍历所有房间并检查对应的存储建筑
    log += Object.values(Game.rooms)
      .map(room => {
        // 统计数量
        const amount = room[source] ? room[source].store[resourceName] || 0 : 0;
        total += amount;

        // 如果有就列出显示
        if (room[source] && amount > 0) return `${room.name} => ${amount}`;
        else return false;
      })
      .filter(res => res)
      .join("\n");

    log += `\n共计: ${total}`;
    return log;
  },

  /**
   * 所有 creep 欢呼
   *
   * @param content 要欢呼的内容
   * @param toPublic 是否对其他人可见
   */
  hail(content = "", toPublic = true): string {
    Object.values(Game.creeps).forEach(creep => creep.say(`${content}!`, toPublic));

    return content ? content : "yeah!";
  },

  /**
   * 对指定房间运行基地查找
   *
   * @param roomName 房间名
   */
  base(roomName: string): string {
    const targetPos = findBaseCenterPos(roomName);
    const firstSpawn = baseLayout[1][STRUCTURE_SPAWN][0];

    if (targetPos.length <= 0) return `[${roomName}] 未找到合适的中心点，请确保该房间中有大于 11*11 的空地。`;

    const logs = [`[${roomName}] 找到如下适合作为基地中心的点位:`];
    logs.push(
      ...targetPos.map(
        pos => `[基地中心] ${pos.x} ${pos.y} [spawn 位置] ${pos.x + firstSpawn[0]}, ${pos.y + firstSpawn[1]}`
      )
    );

    return logs.join("\n");
  },

  /**
   * 绕过房间 api
   * 用于配置在远程寻路时需要避开的房间，注意，该配置将影响所有角色，包括战斗角色。
   * 所以在进攻房间前请确保该房间不在本配置项中
   */
  bypass: {
    /**
     * 添加绕过房间
     *
     * @param roomNames 要添加的绕过房间名列表
     */
    add(...roomNames: string[]): string {
      if (!Memory.bypassRooms) Memory.bypassRooms = [];

      // 确保新增的房间名不会重复
      Memory.bypassRooms = _.uniq([...Memory.bypassRooms, ...roomNames]);

      return `[bypass] 已添加绕过房间，${this.show()}`;
    },

    /**
     * 移除绕过房间
     *
     * @param roomNames 要移除的房间名列表
     */
    remove(...roomNames: string[]): string {
      if (!Memory.bypassRooms) Memory.bypassRooms = [];

      // 移除重复的房间
      if (roomNames.length <= 0) delete Memory.bypassRooms;
      else Memory.bypassRooms = _.difference(Memory.bypassRooms, roomNames);

      return `[bypass] 已移除绕过房间，${this.show()}`;
    },

    /**
     * 显示所有绕过房间
     */
    show(): string {
      if (!Memory.bypassRooms || Memory.bypassRooms.length <= 0) return `当前暂无绕过房间`;
      return `当前绕过房间列表：${Memory.bypassRooms.join(" ")}`;
    }
  },

  /**
   * 掠夺配置 api
   * 用于让 reiver 搬运指定的资源，该列表不存在时将默认搬运所有的资源
   */
  reive: {
    /**
     * 添加要掠夺的资源
     *
     * @param resources 要掠夺的资源
     */
    add(...resources: ResourceConstant[]): string {
      if (!Memory.reiveList) Memory.reiveList = [];

      // 确保新增的资源不会重复
      Memory.reiveList = _.uniq([...Memory.reiveList, ...resources]);

      return `[reiver] 添加成功，${this.show()}`;
    },

    /**
     * 移除要掠夺的资源
     * 参数为空时移除所有
     *
     * @param resources 要移除的掠夺资源
     */
    remove(...resources: ResourceConstant[]): string {
      if (!Memory.reiveList) Memory.reiveList = [];

      // 更新列表
      if (resources.length <= 0) delete Memory.reiveList;
      else Memory.reiveList = _.difference(Memory.reiveList, resources);

      return `[bypass] 移除成功，${this.show()}`;
    },

    /**
     * 显示所有掠夺资源
     */
    show(): string {
      if (!Memory.reiveList || Memory.reiveList.length <= 0) return `暂无特指，将掠夺所有资源`;
      return `当前仅会掠夺如下资源：${Memory.reiveList.join(" ")}`;
    }
  },
  // 将 creepApi 挂载到全局方便手动发布或取消 creep
  creepApi
};
