import { BASE_ROLE_LIMIT } from "@/modules/room/spawn/constant";
import { DEFAULT_FLAG_NAME } from "@/setting";
import { GetName } from "@/modules/room/spawn/nameGetter";
import RoomSpawnController from "@/modules/room/spawn/index";
import { WayPoint } from "@/modules/move";
import log from "@/utils/console/log";
import { removeCreep } from "@/modules/creep/utils";

/**
 * creep 发布工具
 * 基于 RoomSpawnController 的封装
 */
export default class RoomCreepReleaseController {
  public readonly spawner: RoomSpawnController;

  public constructor(spawner: RoomSpawnController) {
    this.spawner = spawner;
  }

  /**
   * 发布采集单位
   * 固定一个 source 发布一个单位
   */
  public harvester(): OK | ERR_NOT_FOUND {
    const { name: roomName, source } = this.spawner.room;

    source.map((thisSource, index) => {
      this.spawner.addTask({
        name: GetName.harvester(roomName, index),
        role: "harvester",
        data: {
          useRoom: roomName,
          harvestRoom: roomName,
          sourceId: thisSource.id
        }
      });
    });

    return OK;
  }

  /**
   * 变更基地运维单位数量
   * 包含数量保护，保证无论怎么减少都有一定的单位执行任务
   *
   * @param type 要更新的单位类别，工人 / 搬运工
   * @param adjust 要增减的数量，为负代表减少
   * @param bodyType 在新增时要设置的特殊体型，减少数量时无效
   */
  public changeBaseUnit(
    type: "worker" | "manager",
    adjust: number,
    bodyType?: SepicalBodyType
  ): OK | ERR_NOT_FOUND | ERR_INVALID_TARGET {
    const { room } = this.spawner;

    // 单位对应在房间内存中保存的键
    const memoryKey = type === "worker" ? "workerNumber" : "transporterNumber";

    // 获取对应的最大数量和最小数量
    let { MIN, MAX } =
      (JSON.parse(this.spawner.room.memory.baseUnitLimit || "{}") as RoomBaseUnitLimit)[type] || BASE_ROLE_LIMIT[type];

    if (room.controller.level >= 8) MIN = MAX = 1;

    const oldNumber = room.memory[memoryKey] || 0;
    // 计算真实的调整量，保证最少有 min 人
    let realAdjust: number;

    // 调整完的人数超过限制了，就增加到最大值
    if (oldNumber + adjust > MAX) realAdjust = MAX - oldNumber;
    // 调整完了人数在正常区间，直接用
    else if (oldNumber + adjust >= MIN) realAdjust = adjust;
    // 调整值导致人数不够了，根据最小值调整
    else realAdjust = oldNumber > MIN ? MIN - oldNumber : oldNumber - MIN;

    if (realAdjust >= 0) {
      // 添加新的单位
      for (let i = oldNumber; i < oldNumber + realAdjust; i++) {
        const creepName = GetName[type](room.name, i);
        if (creepName in Game.creeps) continue;
        this.spawner.addTask({
          name: creepName,
          role: type,
          data: { workRoom: room.name, bodyType }
        });
      }
    } else {
      // 从末尾开始减少单位，减少个数为实际调整值
      for (let i = oldNumber - 1; i >= oldNumber + realAdjust; i--) {
        removeCreep(GetName[type](room.name, i));
      }
    }

    // 更新数量到内存
    room.memory[memoryKey] = oldNumber + realAdjust;

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    room.log(`调整 ${type} 单位数量 [修正] ${realAdjust} [修正后数量] ${room.memory[memoryKey]}`);
    return OK;
  }

  /**
   * 发布中央运输单位
   */
  public processor(): OK | ERR_NOT_FOUND {
    const { room } = this.spawner;
    if (!room.memory.center) return ERR_NOT_FOUND;

    const [x, y] = room.memory.center;
    this.spawner.addTask({
      name: GetName.processor(room.name),
      role: "processor",
      data: { x, y }
    });

    return OK;
  }

  /**
   * 发布外矿角色组
   *
   * @param remoteRoomName 要发布 creep 的外矿房间
   */
  public remoteCreepGroup(remoteRoomName: string): OK {
    const { room } = this.spawner;

    const sourceFlagsName = [`${remoteRoomName} source0`, `${remoteRoomName} source1`];

    // 添加对应数量的外矿采集者
    sourceFlagsName.forEach((flagName, index) => {
      if (!(flagName in Game.flags)) return;

      this.spawner.addTask({
        name: GetName.remoteHarvester(remoteRoomName, index),
        role: "remoteHarvester",
        data: {
          sourceFlagName: flagName,
          targetId: room.memory.remote[remoteRoomName].targetId
        }
      });
    });

    this.remoteReserver(remoteRoomName);
    return OK;
  }

  /**
   * 发布房间预定者
   *
   * @param targetRoomName 要预定的外矿房间名
   */
  public remoteReserver(targetRoomName: string): void {
    this.spawner.addTask({
      name: GetName.reserver(targetRoomName),
      role: "reserver",
      data: { targetRoomName }
    });
  }

  /**
   * 给本房间签名
   *
   * @param content 要签名的内容
   * @param targetRoomName 要签名到的房间名（默认为本房间）
   */
  public sign(content: string, targetRoomName: string = undefined): string {
    const { room } = this.spawner;
    const creepName = GetName.signer(room.name);
    const creep = Game.creeps[creepName];

    // 如果有显存的签名单位就直接签名
    if (creep) {
      (creep.memory.data as RemoteDeclarerData).signText = content;
      return `已将 ${creepName} 的签名内容修改为：${content}`;
    }

    // 否则就发布一个
    this.spawner.addTask({
      name: creepName,
      role: "signer",
      data: {
        targetRoomName: targetRoomName || room.name,
        signText: content
      }
    });

    return `已发布 ${creepName}, 签名内容为：${content}`;
  }

  /**
   * 发布支援角色组
   *
   * @param remoteRoomName 要支援的房间名
   * @param wayPoint 路径点
   */
  public remoteHelper(remoteRoomName: string, wayPoint?: WayPoint): void {
    const room = Game.rooms[remoteRoomName];

    if (!room) {
      log(`目标房间没有视野，无法发布支援单位`, [this.spawner.room.name, "CreepRelease"], "yellow");
      return;
    }

    // 发布 upgrader 和 builder
    this.spawner.addTask({
      name: GetName.remoteUpgrader(remoteRoomName),
      role: "remoteUpgrader",
      data: {
        targetRoomName: remoteRoomName,
        sourceId: room.source[0].id,
        wayPoint
      }
    });
    this.spawner.addTask({
      name: GetName.remoteBuilder(remoteRoomName),
      role: "remoteBuilder",
      data: {
        targetRoomName: remoteRoomName,
        sourceId: room.source.length >= 2 ? room.source[1].id : room.source[0].id
      }
    });
  }

  /**
   * 发布 pbCarrier 小组
   * 由 pbAttacker 调用
   *
   * @param sourceFlagName powerBank 上的旗帜名
   * @param num 孵化几个 carrier
   */
  public pbCarrierGroup(sourceFlagName: string, num: number): void {
    // 如果已经有人发布过了就不再费事了
    if (GetName.pbCarrier(sourceFlagName, 0) in Game.creeps) return;

    for (let i = 0; i < num; i++) {
      this.spawner.addTask({
        name: GetName.pbCarrier(sourceFlagName, i),
        role: "pbCarrier",
        data: { sourceFlagName }
      });
    }
  }

  /**
   * 孵化 pb 采集小组（一红一绿为一组）
   *
   * @param targetFlagName 要采集的旗帜名
   * @param groupNumber 【可选】发布的采集小组数量
   */
  public pbHarvesteGroup(targetFlagName: string, groupNumber = 2): void {
    // 发布 attacker 和 healer，搬运者由 attacker 在后续任务中自行发布
    for (let i = 0; i < groupNumber; i++) {
      const attackerName = GetName.pbAttacker(targetFlagName, i);
      const healerName = GetName.pbHealer(targetFlagName, i);

      // 添加采集小组
      this.spawner.addTask({
        name: attackerName,
        role: "pbAttacker",
        data: {
          sourceFlagName: targetFlagName,
          healerCreepName: healerName
        }
      });
      this.spawner.addTask({
        name: healerName,
        role: "pbHealer",
        data: {
          creepName: attackerName
        }
      });
    }
  }

  /**
   * 孵化 deposit 采集单位
   *
   * @param targetFlagName 要采集的旗帜名
   */
  public depositHarvester(targetFlagName: string): void {
    // 发布采集者，他会自行完成剩下的工作
    this.spawner.addTask({
      name: GetName.depositHarvester(targetFlagName),
      role: "depositHarvester",
      data: {
        sourceFlagName: targetFlagName,
        spawnRoom: this.spawner.room.name
      }
    });
  }

  /**
   * 孵化 boost 进攻一体机
   *
   * @param bearTowerNum 抗塔等级 0-6，等级越高扛伤能力越强，伤害越低
   * @param targetFlagName 目标旗帜名称
   * @param keepSpawn 是否持续生成
   */
  public boostRangedAttacker(
    bearTowerNum: 0 | 1 | 3 | 5 | 2 | 4 | 6 = 6,
    targetFlagName: string = DEFAULT_FLAG_NAME.ATTACK,
    keepSpawn = false
  ): string {
    const { room } = this.spawner;

    if (!room.memory.boost) return `发布失败，未启动 Boost 进程，执行 ${room.name}.war() 来启动战争状态`;
    if (room.memory.boost.state !== "waitBoost") return `无法发布，Boost 材料未准备就绪`;

    const creepName = GetName.boostRangedAttacker(room.name);

    this.spawner.addTask({
      name: creepName,
      role: "boostRangedAttacker",
      data: {
        targetFlagName: targetFlagName || DEFAULT_FLAG_NAME.ATTACK,
        bearTowerNum,
        keepSpawn
      }
    });

    return `已发布进攻一体机 [${creepName}] [扛塔等级] ${bearTowerNum} [进攻旗帜名称] ${targetFlagName} ${
      keepSpawn ? "" : "不"
    }持续生成，GoodLuck Commander`;
  }

  /**
   * 孵化 boost 拆墙小组
   *
   * @param targetFlagName 进攻旗帜名称
   * @param keepSpawn 是否持续生成
   * @param wayPoint 路径点
   */
  public dismantleGroup(targetFlagName = "", keepSpawn = false, wayPoint?: WayPoint): string {
    const { room } = this.spawner;

    if (!room.memory.boost) return `发布失败，未启动 Boost 进程，执行 ${room.name}.war() 来启动战争状态`;
    if (room.memory.boost.state !== "waitBoost") return `无法发布，Boost 材料未准备就绪`;

    const dismantlerName = GetName.boostDismantler(room.name);
    const healerName = GetName.boostHealer(room.name);

    this.spawner.addTask({
      name: dismantlerName,
      role: "boostDismantler",
      data: {
        targetFlagName: targetFlagName || DEFAULT_FLAG_NAME.ATTACK,
        healerName,
        keepSpawn,
        wayPoint
      }
    });
    this.spawner.addTask({
      name: healerName,
      role: "boostHealer",
      data: {
        creepName: dismantlerName,
        keepSpawn,
        wayPoint
      }
    });

    return `已发布拆墙小组，正在孵化，GoodLuck Commander`;
  }

  /**
   * 孵化进攻一体机
   *
   * @param targetFlagName 目标旗帜名称
   * @param num 要孵化的数量
   * @param keepSpawn 是否持续生成
   * @param wayPoint 路径点
   */
  public rangedAttacker(
    targetFlagName: string = DEFAULT_FLAG_NAME.ATTACK,
    num = 1,
    keepSpawn = false,
    wayPoint?: WayPoint
  ): string {
    const { room } = this.spawner;
    for (let i = 0; i < num; i++) {
      const rangedAttackerName = GetName.rangedAttacker(room.name, i);
      this.spawner.addTask({
        name: rangedAttackerName,
        role: "rangedAttacker",
        data: {
          targetFlagName: targetFlagName,
          creepName: rangedAttackerName,
          keepSpawn,
          wayPoint
        }
      });
    }

    return `已发布进攻一体机*${num} [进攻旗帜名称] ${targetFlagName} ${
      keepSpawn ? "" : "不"
    }持续生成，GoodLuck Commander`;
  }

  /**
   * 孵化基础进攻单位
   *
   * @param targetFlagName 进攻旗帜名称
   * @param num 要孵化的数量
   * @param wayPoint 路径点
   */
  public attacker(targetFlagName = "", num = 1, wayPoint?: WayPoint): string {
    if (num <= 0 || num > 10) num = 1;

    for (let i = 0; i < num; i++) {
      this.spawner.addTask({
        name: GetName.attacker(this.spawner.room.name, i),
        role: "attacker",
        data: {
          targetFlagName: targetFlagName || DEFAULT_FLAG_NAME.ATTACK,
          keepSpawn: false,
          wayPoint
        }
      });
    }

    return `已发布 attacker*${num}，正在孵化`;
  }

  /**
   * 孵化基础拆除单位
   * 一般用于清除中立房间中挡路的墙壁
   *
   * @param targetFlagName 进攻旗帜名称
   * @param num 要孵化的数量
   * @param keepSpawn 是否持续生成
   * @param wayPoint 路径点
   */
  public dismantler(targetFlagName = "", num = 2, keepSpawn = false, wayPoint?: WayPoint): string {
    if (num <= 0 || num > 10) num = 1;

    for (let i = 0; i < num; i++) {
      this.spawner.addTask({
        name: GetName.dismantler(this.spawner.room.name, i),
        role: "dismantler",
        data: {
          targetFlagName: targetFlagName || DEFAULT_FLAG_NAME.ATTACK,
          keepSpawn,
          wayPoint
        }
      });
    }

    return `已发布 dismantler*${num}，正在孵化`;
  }

  /**
   * 孵化掠夺者
   *
   * @param sourceFlagName 要搜刮的建筑上插好的旗帜名
   * @param targetStructureId 要把资源存放到的建筑 id
   */
  public reiver(sourceFlagName = "", targetStructureId: Id<StructureWithStore> = undefined): string {
    const { room } = this.spawner;

    if (!targetStructureId && !room.terminal) return `[${room.name}] 发布失败，请填写要存放到的建筑 id`;

    const reiverName = GetName.reiver(room.name);

    this.spawner.addTask({
      name: reiverName,
      role: "reiver",
      data: {
        flagName: sourceFlagName || DEFAULT_FLAG_NAME.REIVER,
        targetId: targetStructureId || room.terminal.id
      }
    });

    return `[${room.name}] 掠夺者 ${reiverName} 已发布, 目标旗帜名称 ${
      sourceFlagName || DEFAULT_FLAG_NAME.REIVER
    }, 将搬运至 ${targetStructureId ? targetStructureId : room.name + " Terminal"}`;
  }

  /**
   * 孵化斥候单位
   *
   * @param targetFlagName 进攻旗帜名称
   * @param num 要孵化的数量
   * @param keepSpawn 是否持续生成
   * @param wayPoint 路径点
   */
  public scout(targetFlagName = "", num = 1, keepSpawn = false, wayPoint?: WayPoint): string {
    const { room } = this.spawner;

    if (num <= 0 || num > 100) num = 1;

    for (let i = 0; i < num; i++) {
      const scoutName = GetName.scout(room.name, i);
      this.spawner.addTask({
        name: scoutName,
        role: "scout",
        data: {
          targetFlagName: targetFlagName || DEFAULT_FLAG_NAME.SCOUT,
          keepSpawn,
          wayPoint
        }
      });
    }

    return `已发布 scout*${num}，正在孵化`;
  }
}
