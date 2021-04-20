import { BOOST_RESOURCE, boostEnergyReloadLimit, boostResourceReloadLimit } from "@/setting";
import { confirmBasePos, findBaseCenterPos, setBaseCenter } from "@/modules/autoPlanning/planBasePos";
import { GetName } from "@/modules/room/spawn/nameGetter";
import createRoomLink from "@/utils/console/createRoomLink";
import log from "@/utils/console/log";
import { manageStructure } from "@/modules/autoPlanning";
import { removeCreep } from "@/modules/creep/utils";

export default class RoomExtension extends Room {
  /**
   * 全局日志
   *
   * @param content 日志内容
   * @param instanceName 前缀中包含的内容
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  public log(content: string, instanceName = "", color: Colors | undefined = undefined, notify = false): void {
    // 为房间名添加超链接
    const roomName = createRoomLink(this.name);
    // 生成前缀并打印日志
    const prefixes = instanceName ? [roomName, instanceName] : [roomName];
    log(content, prefixes, color, notify);
  }

  /**
   * 向房间中发布 power 请求任务
   * 该方法已集成了 isPowerEnabled 判定，调用该方法之前无需额外添加房间是否启用 power 的逻辑
   *
   * @param task 要添加的 power 任务
   * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
   * @returns OK 添加成功
   * @returns ERR_NAME_EXISTS 已经有同名任务存在了
   * @returns ERR_INVALID_TARGET 房间控制器未启用 power
   */
  public addPowerTask(task: PowerConstant, priority: number = null): OK | ERR_NAME_EXISTS | ERR_INVALID_TARGET {
    // 初始化时添加房间初始化任务（编号 -1）
    if (!this.memory.powerTasks) this.memory.powerTasks = [-1 as PowerConstant];
    if (!this.controller.isPowerEnabled) return ERR_INVALID_TARGET;

    // 有相同的就拒绝添加
    if (this.hasPowerTask(task)) return ERR_NAME_EXISTS;

    // 发布任务到队列
    if (!priority) this.memory.powerTasks.push(task);
    // 追加到队列指定位置
    else this.memory.powerTasks.splice(priority, 0, task);

    return OK;
  }

  /**
   * 检查是否已经存在指定任务
   *
   * @param task 要检查的 power 任务
   */
  private hasPowerTask(task: PowerConstant): boolean {
    return !!this.memory.powerTasks.find(power => power === task);
  }

  /**
   * 获取当前的 power 任务
   */
  public getPowerTask(): PowerConstant | undefined {
    if (!this.memory.powerTasks || this.memory.powerTasks.length <= 0) return undefined;
    else return this.memory.powerTasks[0];
  }

  /**
   * 挂起当前任务
   * 将会把最前面的 power 任务移动到队列末尾
   */
  public hangPowerTask(): void {
    const task = this.memory.powerTasks.shift();
    this.memory.powerTasks.push(task);
  }

  /**
   * 移除第一个 power 任务
   */
  public deleteCurrentPowerTask(): void {
    this.memory.powerTasks.shift();
  }

  /**
   * 将指定位置序列化为字符串
   * 形如: 12/32/E1N2
   *
   * @param pos 要进行压缩的位置
   */
  public serializePos(pos: RoomPosition): string {
    return `${pos.x}/${pos.y}/${pos.roomName}`;
  }

  /**
   * 将位置序列化字符串转换为位置
   * 位置序列化字符串形如: 12/32/E1N2
   *
   * @param posStr 要进行转换的字符串
   */
  public unserializePos(posStr: string): RoomPosition | undefined {
    // 形如 ["12", "32", "E1N2"]
    const infos = posStr.split("/");

    return infos.length === 3 ? new RoomPosition(Number(infos[0]), Number(infos[1]), infos[2]) : undefined;
  }

  /**
   * 危险操作：执行本 api 将会直接将本房间彻底移除
   */
  public dangerousRemove(): string {
    // 移除建筑
    this.find(FIND_STRUCTURES).forEach(s => {
      if (
        s.structureType === STRUCTURE_STORAGE ||
        s.structureType === STRUCTURE_TERMINAL ||
        s.structureType === STRUCTURE_WALL ||
        s.structureType === STRUCTURE_RAMPART
      )
        return;

      s.destroy();
    });

    // 移除 creep config
    removeCreep(this.name, { batch: true, immediate: true });

    // 移除内存
    delete this.memory;
    delete Memory.stats.rooms[this.name];

    // 放弃房间
    this.controller.unclaim();

    return this.name + " 房间已移除";
  }

  /**
   * 在本房间中查找可以放置基地的位置
   * 会将可选位置保存至房间内存
   *
   * @returns 可以放置基地的中心点
   */
  public findBaseCenterPos(): RoomPosition[] {
    const targetPos = findBaseCenterPos(this.name);
    this.memory.centerCandidates = targetPos.map(pos => [pos.x, pos.y]);

    return targetPos;
  }

  /**
   * 确定基地选址
   * 从给定的位置中挑选一个最优的作为基地中心点，如果没有提供的话就从 memory.centerCandidates 中挑选
   * 挑选完成后会自动将其设置为中心点
   *
   * @param targetPos 待选的中心点数组
   */
  public confirmBaseCenter(targetPos: RoomPosition[] = undefined): RoomPosition | ERR_NOT_FOUND {
    if (!targetPos) {
      if (!this.memory.centerCandidates) return ERR_NOT_FOUND;
      targetPos = this.memory.centerCandidates.map(c => new RoomPosition(c[0], c[1], this.name));
    }

    const center = confirmBasePos(this, targetPos);
    setBaseCenter(this, center);
    delete this.memory.centerCandidates;

    return center;
  }

  /**
   * 设置基地中心
   * @param pos 中心点位
   */
  public setBaseCenter(pos: RoomPosition): OK | ERR_INVALID_ARGS {
    return setBaseCenter(this, pos);
  }

  /**
   * 执行自动建筑规划
   */
  public planLayout(): string {
    const result = manageStructure(this);

    if (result === OK) return `自动规划完成`;
    else if (result === ERR_NOT_OWNER) return `自动规划失败，房间没有控制权限`;
    else return `未找到基地中心点位，请执行 Game.rooms.${this.name}.setcenter 以启用自动规划`;
  }

  /**
   * 切换为战争状态
   * 需要提前插好名为 [房间名 + Boost] 的旗帜，并保证其周围有足够数量的 lab
   *
   * @param boostType 以什么形式启动战争状态
   * @returns ERR_NAME_EXISTS 已经处于战争状态
   * @returns ERR_NOT_FOUND 未找到强化旗帜
   * @returns ERR_INVALID_TARGET 强化旗帜附近的lab数量不足
   */
  public startWar(boostType: BoostType): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET {
    if (this.memory.war) return ERR_NAME_EXISTS;
    this.memory.war = {};
    // 发布 boost 任务
    return this.releaseBoostTask(boostType);
  }

  /**
   * 强化指定 creep
   *
   * @param creep 要进行强化的 creep，该 creep 应站在指定好的强化位置上
   * @returns ERR_NOT_FOUND 未找到boost任务
   * @returns ERR_BUSY boost尚未准备完成
   * @returns ERR_NOT_IN_RANGE creep不在强化位置上
   */
  public boostCreep(creep: Creep): OK | ERR_NOT_FOUND | ERR_BUSY | ERR_NOT_IN_RANGE {
    if (!this.memory.boost) return ERR_NOT_FOUND;

    // 检查是否准备好了
    if (this.memory.boost.state !== "waitBoost") return ERR_BUSY;

    // 获取全部 lab
    const executiveLab: StructureLab[] = [];
    for (const resourceType in this.memory.boost.lab) {
      const lab = Game.getObjectById(this.memory.boost.lab[resourceType]);
      if (lab?.store[RESOURCE_ENERGY] <= boostEnergyReloadLimit) {
        if (!this.transport.hasTask("boostGetEnergy")) this.transport.addTask({ type: "boostGetEnergy", priority: 10 });
        return ERR_BUSY;
      } else if (lab?.store[resourceType] <= boostResourceReloadLimit) {
        if (!this.transport.hasTask("boostGetResource"))
          this.transport.addTask({ type: "boostGetResource", priority: 15 });
        return ERR_BUSY;
      }
      // 这里没有直接终止进程是为了避免 lab 集群已经部分被摧毁而导致整个 boost 进程无法执行
      if (lab) executiveLab.push(lab);
    }

    // 执行强化
    const boostResults = executiveLab.map(lab => lab.boostCreep(creep));

    // 有一个强化成功了就算强化成功
    if (boostResults.includes(OK)) {
      // 强化成功了就发布资源填充任务是因为
      // 在方法返回 OK 时，还没有进行 boost（将在 tick 末进行），所以这里检查资源并不会发现有资源减少
      // 为了提高存储量，这里直接发布任务，交给 manager 在处理任务时检查是否有资源不足的情况

      return OK;
    } else return ERR_NOT_IN_RANGE;
  }

  /**
   * 解除战争状态
   * 会同步取消 boost 进程
   */
  public stopWar(): OK | ERR_NOT_FOUND {
    if (!this.memory.war) return ERR_NOT_FOUND;

    // 将 boost 状态置为 clear，labExtension 会自动发布清理任务并移除 boostTask
    if (this.memory.boost) this.memory.boost.state = "boostClear";
    delete this.memory.war;

    return OK;
  }

  /**
   * 占领新房间
   * 本方法只会发布占领单位，等到占领成功后 claimer 会自己发布支援单位
   *
   * @param targetRoomName 要占领的目标房间
   * @param signText 新房间的签名
   */
  public claimRoom(targetRoomName: string, signText = ""): OK {
    this.spawner.addTask({
      name: GetName.claimer(targetRoomName),
      role: "claimer",
      data: { targetRoomName, signText }
    });

    return OK;
  }

  /**
   * 拓展新的外矿
   *
   * @param remoteRoomName 要拓展的外矿房间名
   * @returns ERR_INVALID_TARGET targetId 找不到对应的建筑
   * @returns ERR_NOT_FOUND 没有找到足够的 source 旗帜
   */
  public addRemote(remoteRoomName: string): OK | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    if (!this.memory.remote) this.memory.remote = {};

    // 添加对应的键值对
    this.memory.remote[remoteRoomName] = { targetId: this.storage.id };

    this.spawner.release.remoteCreepGroup(remoteRoomName);
    return OK;
  }

  /**
   * 移除外矿
   *
   * @param remoteRoomName 要移除的外矿
   * @param removeFlag 是否移除外矿的 source 旗帜
   */
  public removeRemote(remoteRoomName: string, removeFlag = false): OK | ERR_NOT_FOUND {
    // 兜底
    if (!this.memory.remote) return ERR_NOT_FOUND;
    if (!(remoteRoomName in this.memory.remote)) return ERR_NOT_FOUND;

    delete this.memory.remote[remoteRoomName];
    if (Object.keys(this.memory.remote).length <= 0) delete this.memory.remote;

    const sourceFlagsName = [`${remoteRoomName} source0`, `${remoteRoomName} source1`];
    // 移除对应的旗帜和外矿采集单位
    sourceFlagsName.forEach((flagName, index) => {
      if (!(flagName in Game.flags)) return;

      if (removeFlag) Game.flags[flagName].remove();
      removeCreep(GetName.remoteHarvester(remoteRoomName, index));
    });

    // 移除预定者
    removeCreep(GetName.reserver(remoteRoomName));

    return OK;
  }

  /**
   * 切换为升级状态
   * 需要提前插好名为 [房间名 + Boost] 的旗帜，并保证其周围有足够数量的 lab
   *
   * @returns ERR_NAME_EXISTS 已经处于升级状态
   * @returns ERR_NOT_FOUND 未找到强化旗帜
   * @returns ERR_INVALID_TARGET 强化旗帜附近的lab数量不足
   */
  public startUpgrade(): OK | ERR_NAME_EXISTS | ERR_NOT_FOUND | ERR_INVALID_TARGET {
    if (this.memory.upgrade) return ERR_NAME_EXISTS;
    this.memory.upgrade = {};
    // 发布 boost 任务
    return this.releaseBoostTask("UPGRADE");
  }

  /**
   * 解除战争状态
   * 会同步取消 boost 进程
   */
  public stopUpgrade(): OK | ERR_NOT_FOUND {
    if (!this.memory.upgrade) return ERR_NOT_FOUND;

    // 将 boost 状态置为 clear，labExtension 会自动发布清理任务并移除 boostTask
    if (this.memory.boost) this.memory.boost.state = "boostClear";
    delete this.memory.upgrade;

    return OK;
  }

  /**
   * 发布 Boost 任务
   * 需要提前插好名为 [房间名 + Boost] 的旗帜，并保证其周围有足够数量的 lab
   *
   * @param boostType boost 形式
   * @returns ERR_NOT_FOUND 未找到强化旗帜
   * @returns ERR_INVALID_TARGET 强化旗帜附近的lab数量不足
   */
  private releaseBoostTask(boostType: BoostType): OK | ERR_NOT_FOUND | ERR_INVALID_TARGET {
    // 获取 boost 旗帜
    const boostFlagName = this.name + "Boost";
    const boostFlag = Game.flags[boostFlagName];
    if (!boostFlag) return ERR_NOT_FOUND;

    // 获取执行强化的 lab
    const labs = boostFlag.pos.findInRange<StructureLab>(FIND_STRUCTURES, 1, {
      filter: s => s.structureType === STRUCTURE_LAB
    });
    // 如果 lab 数量不够
    if (labs.length < BOOST_RESOURCE[boostType].length) return ERR_INVALID_TARGET;

    // 初始化 boost 任务
    const boostTask: BoostTask = {
      state: "boostGet",
      pos: [boostFlag.pos.x, boostFlag.pos.y],
      type: boostType,
      lab: {}
    };

    // 统计需要执行强化工作的 lab 并保存到内存
    BOOST_RESOURCE[boostType].forEach(res => (boostTask.lab[res] = labs.pop().id));
    this.memory.boost = boostTask;
    return OK;
  }
}
