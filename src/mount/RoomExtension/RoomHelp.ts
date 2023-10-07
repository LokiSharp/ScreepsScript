/**
 * Room 控制台交互
 *
 * 本文件包含了 Room 中用于控制台交互的方法
 */
import { DEFAULT_FLAG_NAME } from "@/setting";
import RoomExtension from "./RoomExtension";
import { createHelp } from "@/modules/help";

export default class RoomHelp extends RoomExtension {
  /**
   * 用户操作 - 房间操作帮助
   */
  public help(): string {
    const moduleList: ModuleDescribe[] = [
      {
        name: "资源调配 API",
        describe: "用于介入房间内部的资源流转或者向其他房间调配资源",
        api: [
          {
            title: "添加中央运输任务",
            params: [
              {
                name: "targetType",
                desc: "资源存放建筑类型，STRUCTURE_FACTORY STRUCTURE_STORAGE STRUCTURE_TERMINAL 之一"
              },
              { name: "sourceType", desc: "资源来源建筑类型，同上" },
              { name: "resourceType", desc: "要转移的资源类型" },
              { name: "amount", desc: "要转移的数量" }
            ],
            functionName: "ctadd"
          },
          {
            title: "发送能量",
            describe: "该操作会自动从 storage 里取出能量",
            params: [
              { name: "roomName", desc: "要发送到的房间名" },
              { name: "amount", desc: "[可选] 要转移的能量数量, 默认 100k" }
            ],
            functionName: "givee"
          },
          {
            title: "发送资源",
            params: [
              { name: "roomName", desc: "要发送到的房间名" },
              { name: "resourceType", desc: "要发送的资源类型" },
              { name: "amount", desc: "[可选] 要转移的能量数量, 默认 1k" }
            ],
            functionName: "giver"
          },
          {
            title: "移出能量",
            describe: "将能量从 storage 转移至 terminal 里",
            params: [{ name: "amount", desc: "[可选] 要转移的能量数量, 默认 100k" }],
            functionName: "pute"
          },
          {
            title: "移入能量",
            describe: "将能量从 terminal 转移至 storage 里",
            params: [{ name: "amount", desc: "[可选] 要转移的能量数量, 默认 100k" }],
            functionName: "gete"
          },
          {
            title: "新增 BUY 单",
            describe: "订单的交易房为本房间",
            params: [
              { name: "resourceType", desc: "要购买的资源类型" },
              { name: "price", desc: "单价" },
              { name: "totalAmount", desc: "总量" }
            ],
            functionName: "buy"
          },
          {
            title: "新增 SELL 单",
            describe: "订单的交易房为本房间",
            params: [
              { name: "resourceType", desc: "要卖出的资源类型" },
              { name: "price", desc: "单价" },
              { name: "totalAmount", desc: "总量" }
            ],
            functionName: "sell"
          },
          {
            title: "拍下订单",
            params: [
              { name: "id", desc: "订单 id" },
              { name: "amount", desc: "[可选] 交易数量，默认为全部" }
            ],
            functionName: "deal"
          }
        ]
      },
      {
        name: "建筑管控 API",
        describe: "用于管理房间中的建筑集群，部分 API 继承自对应建筑原型。",
        api: [
          {
            title: "添加终端任务",
            describe: "terminal.add 的别名",
            functionName: "ta"
          },
          {
            title: "移除终端任务",
            describe: "terminal.remove 的别名",
            functionName: "tr"
          },
          {
            title: "显示终端任务",
            describe: "terminal.show 的别名",
            functionName: "ts"
          },
          {
            title: "初始化 lab 集群",
            functionName: "linit"
          },
          {
            title: "暂停 lab 集群",
            functionName: "loff"
          },
          {
            title: "重启 lab 集群",
            functionName: "lon"
          },
          {
            title: "显示 lab 集群状态",
            functionName: "lshow"
          }
        ]
      },
      {
        name: "房间拓展 API",
        describe: "用于执行本房间的对外扩张计划",
        api: [
          {
            title: "拓展新外矿",
            params: [{ name: "remoteRoomName", desc: "要拓展的外矿房间名" }],
            functionName: "radd"
          },
          {
            title: "移除外矿",
            params: [
              { name: "remoteRoomName", desc: "要移除的外矿房间名" },
              { name: "removeFlag", desc: "是否顺便把外矿 source 上的旗帜也移除了" }
            ],
            functionName: "rremove"
          },
          {
            title: "占领新房间",
            params: [
              { name: "targetRoomName", desc: "要占领的房间名" },
              { name: "signText", desc: "[可选] 新房间的签名，默认为空" }
            ],
            functionName: "claim"
          }
        ]
      },
      {
        name: "房间管理 API",
        describe:
          "包含本房间的一些基础接口，本模块的大多数 API 都已实现自动调用，除非房间运转出现问题，否则不需要手动进行调用。",
        api: [
          {
            title: "运行建筑布局",
            describe: "本方法依赖于 setcenter 方法，已自动化，默认在 controller 升级时调用",
            functionName: "planLayout"
          },
          {
            title: "设置基地中心点",
            describe: "运行建筑自动布局依赖于本方法，已自动化，在 claim 新房间后会自动设置",
            params: [{ name: "flagName", desc: "中心点上的 flag 名称" }],
            functionName: "setcenter"
          },
          {
            title: "移除墙壁",
            describe: "移除本房间中所有墙壁 (包括非己方的 Rempart)",
            functionName: "clearwall"
          },
          {
            title: "给本房间签名",
            params: [
              { name: "content", desc: "要签名的内容" },
              { name: "targetRoomName", desc: "[可选] 要签名的房间名（默认为本房间）" }
            ],
            functionName: "sign"
          },
          {
            title: "移除本房间",
            describe: "会移除房间内的建筑（不包括墙壁）、移除对应的 creep 及 memory，需二次确认",
            functionName: "remove"
          },
          {
            title: "启动升级",
            describe: "进入升级状态，会同步启动 boost 进程",
            functionName: "upgrade"
          },
          {
            title: "结束升级",
            describe: "解除升级状态并回收 boost 材料",
            functionName: "noupgrade"
          }
        ]
      },
      {
        name: "战争 API",
        describe: "用于启动 / 执行 / 终止战争",
        api: [
          {
            title: "启动战争",
            describe: "进入战争状态，会同步启动 boost 进程",
            functionName: "war"
          },
          {
            title: "结束战争",
            describe: "解除战争状态并回收 boost 材料",
            functionName: "nowar"
          },
          {
            title: "孵化进攻单位",
            describe: "孵化基础、无 boost 的红球单位",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              { name: "num", desc: "[可选] 要孵化的数量，1 - 10，默认为 1" },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnAttacker"
          },
          {
            title: "孵化拆除单位",
            describe: "孵化基础、无 boost 、无 TOUGH 的黄球单位",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              { name: "num", desc: "[可选] 要孵化的数量，1 - 10，默认为 2" },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnDismantler"
          },
          {
            title: "孵化强化进攻一体机",
            describe: "孵化基础、无 boost 、无 TOUGH 的进攻一体机单位",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnRangedAttacker"
          },
          {
            title: "孵化强化进攻单位",
            describe: "<需要战争状态> 孵化完全 boost 的红球单位",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              { name: "num", desc: "[可选] 要孵化的数量，1 - 10，默认为 1" }
            ],
            functionName: "spawnBoostAttacker"
          },
          {
            title: "孵化强化拆除单位",
            describe: "<需要战争状态> 孵化完全 boost 黄球单位",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              { name: "num", desc: "[可选] 要孵化的数量，1 - 10，默认为 2" },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnBoostDismantler"
          },
          {
            title: "孵化强化进攻一体机",
            describe: "<需要战争状态> 包含完全 boost 的蓝绿球单位",
            params: [
              { name: "bearTowerNum", desc: "[可选] 抗塔等级 0-6，等级越高扛伤能力越强，伤害越低，默认为 6" },
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnBoostRangedAttacker"
          },
          {
            title: "孵化拆墙小组",
            describe: "包含未 boost 的黄球 / 绿球双人小组",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnDismantleGroup"
          },
          {
            title: "孵化进攻小组",
            describe: "包含未 boost 的红球 / 绿球双人小组",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnAttackGroup"
          },
          {
            title: "孵化强化拆墙小组",
            describe: "<需要战争状态> 包含完全 boost 的黄球 / 绿球双人小组",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnBoostDismantleGroup"
          },
          {
            title: "孵化强化进攻小组",
            describe: "<需要战争状态> 包含完全 boost 的红球 / 绿球双人小组",
            params: [
              { name: "targetFlagName", desc: `[可选] 进攻旗帜名称，默认为 ${DEFAULT_FLAG_NAME.ATTACK}` },
              {
                name: "keepSpawn",
                desc: '[可选] 是否持续生成，置为 true 时可以执行 creepApi.remove("creepName") 来终止持续生成，默认为 false'
              }
            ],
            functionName: "spawnBoostAttackGroup"
          },
          {
            title: "孵化掠夺者",
            params: [
              { name: "sourceFlagName", desc: `[可选] 要搜刮的建筑上插好的旗帜名，默认为 ${DEFAULT_FLAG_NAME.REIVER}` },
              { name: "targetStructureId", desc: `[可选] 要把资源存放到的建筑 id，默认为房间终端` }
            ],
            functionName: "spawnReiver"
          }
        ]
      }
    ];
    return createHelp(...moduleList);
  }
}
