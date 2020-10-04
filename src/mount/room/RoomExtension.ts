import { createRoomLink } from "utils/createRoomLink";
import { creepApi } from "modules/creepController";
import { log } from "utils/log";
import { releaseCreep } from "modules/autoPlanning/planCreep";

export default class RoomExtension extends Room {
  /**
   * 全局日志
   *
   * @param content 日志内容
   * @param prefixes 前缀中包含的内容
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
   * 为本房间添加新的 source container
   * 会触发 creep 发布
   *
   * @param container 要登记的 container
   */
  public registerContainer(container: StructureContainer): OK {
    // 把 container 添加到房间基础服务
    if (!this.memory.sourceContainersIds) this.memory.sourceContainersIds = [];
    // 去重，防止推入了多个相同的 container
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.memory.sourceContainersIds = _.uniq([...this.memory.sourceContainersIds, container.id]);

    // 触发对应的 creep 发布规划
    this.releaseCreep("filler");
    this.releaseCreep("upgrader");

    return OK;
  }

  /**
   * 向生产队列里推送一个生产任务
   *
   * @param taskName config.creep.ts 文件里 creepConfigs 中定义的任务名
   * @returns 当前任务在队列中的排名
   */
  public addSpawnTask(taskName: string): number | ERR_NAME_EXISTS {
    if (!this.memory.spawnList) this.memory.spawnList = [];
    // 先检查下任务是不是已经在队列里了
    if (!this.hasSpawnTask(taskName)) {
      // 任务加入队列
      this.memory.spawnList.push(taskName);
      return this.memory.spawnList.length - 1;
    }
    // 如果已经有的话返回异常
    else return ERR_NAME_EXISTS;
  }

  /**
   * 检查生产队列中是否包含指定任务
   *
   * @param taskName 要检查的任务名
   * @returns true/false 有/没有
   */
  public hasSpawnTask(taskName: string): boolean {
    if (!this.memory.spawnList) this.memory.spawnList = [];
    return this.memory.spawnList.indexOf(taskName) > -1;
  }

  /**
   * 清空任务队列
   * 非测试情况下不要调用！
   */
  public clearSpawnTask(): void {
    this.memory.spawnList = [];
  }

  /**
   * 将当前任务挂起
   * 任务会被移动至队列末尾
   */
  public hangSpawnTask(): void {
    const task = this.memory.spawnList.shift();
    this.memory.spawnList.push(task);
  }

  /**
   * 给本房间发布或重新规划指定的 creep 角色
   * @param role 要发布的 creep 角色
   */
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  releaseCreep(role: BaseRoleConstant): ScreepsReturnCode {
    return releaseCreep(this, role);
  }

  /**
   * 添加禁止通行位置
   *
   * @param creepName 禁止通行点位的注册者
   * @param pos 禁止通行的位置
   */
  public addRestrictedPos(creepName: string, pos: RoomPosition): void {
    if (!this.memory.restrictedPos) this.memory.restrictedPos = {};

    this.memory.restrictedPos[creepName] = this.serializePos(pos);
  }

  /**
   * 获取房间内的禁止通行点位
   */
  public getRestrictedPos(): { [creepName: string]: string } {
    return this.memory.restrictedPos;
  }

  /**
   * 将指定位置从禁止通行点位中移除
   *
   * @param creepName 要是否点位的注册者名称
   */
  public removeRestrictedPos(creepName: string): void {
    if (!this.memory.restrictedPos) this.memory.restrictedPos = {};

    delete this.memory.restrictedPos[creepName];
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
   * 查找房间中的有效能量来源
   */
  public getAvailableSource(): StructureTerminal | StructureStorage | StructureContainer | Source {
    // terminal 或 storage 里有能量就优先用
    if (this.terminal && this.terminal.store[RESOURCE_ENERGY] > 10000) return this.terminal;
    if (this.storage && this.storage.store[RESOURCE_ENERGY] > 100000) return this.storage;
    // 如果有 sourceConainer 的话就挑个多的
    if (this.sourceContainers.length > 0)
      return _.max(this.sourceContainers, container => container.store[RESOURCE_ENERGY]);

    // 没有就选边上有空位的 source
    return this.sources.find(source => {
      const freeCount = source.pos.getFreeSpace().length;
      const harvestCount = source.pos.findInRange(FIND_CREEPS, 1).length;

      return freeCount - harvestCount > 0;
    });
  }

  /**
   * 向房间物流任务队列推送新的任务
   *
   * @param task 要添加的任务
   * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
   * @returns 任务的排队位置, 0 是最前面，-1 为添加失败（已有同种任务）
   */
  public addRoomTransferTask(task: RoomTransferTasks, priority: number = null): number {
    if (this.hasRoomTransferTask(task.type)) return -1;

    // 默认追加到队列末尾
    if (!priority) {
      this.memory.transferTasks.push(task);
      return this.memory.transferTasks.length - 1;
    }
    // 追加到队列指定位置
    else {
      this.memory.transferTasks.splice(priority, 0, task);
      return priority < this.memory.transferTasks.length ? priority : this.memory.transferTasks.length - 1;
    }
  }

  /**
   * 是否有相同的房间物流任务
   * 房间物流队列中一种任务只允许同时存在一个
   *
   * @param taskType 任务类型
   */
  public hasRoomTransferTask(taskType: string): boolean {
    if (!this.memory.transferTasks) this.memory.transferTasks = [];

    // eslint-disable-next-line no-shadow
    const task = this.memory.transferTasks.find(task => task.type === taskType);
    return task ? true : false;
  }

  /**
   * 获取当前的房间物流任务
   */
  public getRoomTransferTask(): RoomTransferTasks | null {
    if (!this.memory.transferTasks) this.memory.transferTasks = [];

    if (this.memory.transferTasks.length <= 0) {
      return null;
    } else {
      return this.memory.transferTasks[0];
    }
  }

  /**
   * 移除当前处理的房间物流任务
   * 并统计至 Memory.stats
   */
  public deleteCurrentRoomTransferTask(): void {
    const finishedTask = this.memory.transferTasks.shift();

    // // 先兜底
    if (!Memory.stats) Memory.stats = { rooms: {} };
    if (!Memory.stats.roomTaskNumber) Memory.stats.roomTaskNumber = {};

    // 如果这个任务之前已经有过记录的话就增 1
    if (Memory.stats.roomTaskNumber[finishedTask.type]) Memory.stats.roomTaskNumber[finishedTask.type] += 1;
    // 没有就设为 1
    else Memory.stats.roomTaskNumber[finishedTask.type] = 1;
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
   * 拓展新的外矿
   *
   * @param remoteRoomName 要拓展的外矿房间名
   * @param targetId 能量搬到哪个建筑里
   * @returns ERR_INVALID_TARGET targetId 找不到对应的建筑
   * @returns ERR_NOT_FOUND 没有找到足够的 source 旗帜
   */
  public addRemote(remoteRoomName: string, targetId: string): OK | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    // target 建筑一定要有
    if (!Game.getObjectById(targetId as Id<Room>)) return ERR_INVALID_TARGET;
    // 目标 source 也至少要有一个
    const sourceFlagsName = [`${remoteRoomName} source0`, `${remoteRoomName} source1`];
    if (!(sourceFlagsName[0] in Game.flags)) return ERR_NOT_FOUND;
    // 兜底
    if (!this.memory.remote) this.memory.remote = {};

    // 添加对应的键值对
    this.memory.remote[remoteRoomName] = { targetId };

    this.addRemoteCreepGroup(remoteRoomName);
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
      creepApi.remove(`${remoteRoomName} remoteHarvester${index}`);
    });

    // 移除预定者
    creepApi.remove(`${remoteRoomName} reserver`);

    return OK;
  }
}
