import getRoomFactoryState from "@/utils/global/getRoomFactoryState";

export default function (): string {
  if (!Memory.commodities) return "未启动商品生产线";

  const statsStr = [];
  // 遍历所有等级的房间
  for (const level in Memory.commodities) {
    // eslint-disable-next-line no-prototype-builtins
    if (Memory.commodities.hasOwnProperty(level)) {
      statsStr.push(`[${level} 级工厂]`);
      const nodeNames = Memory.commodities[level as "1" | "2" | "3" | "4" | "5"];
      if (nodeNames.length <= 0) {
        statsStr.push("    - 无");
        continue;
      }

      // 遍历所有房间
      // 这里返回的是筛选过的房间名
      // 所有访问不到的房间会被替换成 false
      const currentRoomNames = nodeNames.map(roomName => {
        if (!Game.rooms[roomName] || !Game.rooms[roomName].factory) {
          statsStr.push(`    - [${roomName}] 房间无视野或无工厂，已移除`);
          return false;
        }

        statsStr.push(getRoomFactoryState(Game.rooms[roomName]));
        return roomName;
      });

      // 剔除所有 false 并回填
      Memory.commodities[level] = currentRoomNames.filter(roomName => !_.isUndefined(roomName));
    }
  }

  return statsStr.join("\n");
}

declare global {
  interface Memory {
    /**
     * 商品生产线配置
     * 键为工厂等级，值为被设置成对应等级的工厂所在房间名
     */
    commodities: {
      [level in FactoryLevel]: string[];
    };
  }
}
