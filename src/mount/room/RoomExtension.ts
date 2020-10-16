import { clearStructure, planLayout } from "modules/autoPlanning/planBaseLayout";
import { confirmBasePos, findBaseCenterPos, setBaseCenter } from "modules/autoPlanning/planBasePos";
import { ENERGY_SHARE_LIMIT } from "setting";
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
   * 添加任务
   *
   * @param task 要提交的任务
   * @param priority 任务优先级位置，默认追加到队列末尾。例：该值为 0 时将无视队列长度直接将任务插入到第一个位置
   * @returns 任务的排队位置, 0 是最前面，负数为添加失败，-1 为已有同种任务,-2 为目标建筑无法容纳任务数量
   */
  public addCenterTask(task: ITransferTask, priority: number = null): number {
    if (this.hasCenterTask(task.submit)) return -1;
    // 由于这里的目标建筑限制型和非限制型存储都有，这里一律作为非限制性检查来减少代码量
    if (
      this[task.target] &&
      (this[task.target].store as StoreDefinitionUnlimited).getFreeCapacity(task.resourceType) < task.amount
    )
      return -2;

    if (!priority) this.memory.centerTransferTasks.push(task);
    else this.memory.centerTransferTasks.splice(priority, 0, task);

    return this.memory.centerTransferTasks.length - 1;
  }

  /**
   * 每个建筑同时只能提交一个任务
   *
   * @param submit 提交者的身份
   * @returns 是否有该任务
   */
  public hasCenterTask(submit: CenterStructures | number): boolean {
    if (!this.memory.centerTransferTasks) this.memory.centerTransferTasks = [];

    const task = this.memory.centerTransferTasks.find(_task => _task.submit === submit);
    return task ? true : false;
  }

  /**
   * 暂时挂起当前任务
   * 会将任务放置在队列末尾
   *
   * @returns 任务的排队位置, 0 是最前面
   */
  public hangCenterTask(): number {
    const task = this.memory.centerTransferTasks.shift();
    this.memory.centerTransferTasks.push(task);

    return this.memory.centerTransferTasks.length - 1;
  }

  /**
   * 获取中央队列中第一个任务信息
   *
   * @returns 有任务返回任务, 没有返回 null
   */
  public getCenterTask(): ITransferTask | null {
    if (!this.memory.centerTransferTasks) this.memory.centerTransferTasks = [];

    if (this.memory.centerTransferTasks.length <= 0) {
      return null;
    } else {
      return this.memory.centerTransferTasks[0];
    }
  }

  /**
   * 处理任务
   *
   * @param submitId 提交者的 id
   * @param transferAmount 本次转移的数量
   */
  public handleCenterTask(transferAmount: number): void {
    this.memory.centerTransferTasks[0].amount -= transferAmount;
    if (this.memory.centerTransferTasks[0].amount <= 0) {
      this.deleteCurrentCenterTask();
    }
  }

  /**
   * 移除当前中央运输任务
   */
  public deleteCurrentCenterTask(): void {
    this.memory.centerTransferTasks.shift();
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

  /**
   * 向其他房间请求资源共享
   *
   * @param resourceType 请求的资源类型
   * @param amount 请求的数量
   */
  public shareRequest(resourceType: ResourceConstant, amount: number): boolean {
    const targetRoom = this.shareGetSource(resourceType);
    if (!targetRoom) return false;

    const addResult = targetRoom.shareAdd(this.name, resourceType, amount);
    return addResult;
  }

  /**
   * 将本房间添加至资源来源表中
   *
   * @param resourceType 添加到的资源类型
   */
  public shareAddSource(resourceType: ResourceConstant): boolean {
    if (!(resourceType in Memory.resourceSourceMap)) Memory.resourceSourceMap[resourceType] = [];

    const alreadyRegister = Memory.resourceSourceMap[resourceType].find(name => name === this.name);
    // 如果已经被添加过了就返回 false
    if (alreadyRegister) return false;

    Memory.resourceSourceMap[resourceType].push(this.name);
    return true;
  }

  /**
   * 从资源来源表中移除本房间房间
   *
   * @param resourceType 从哪种资源类型中移除
   */
  public shareRemoveSource(resourceType: ResourceConstant): void {
    // 没有该资源就直接停止
    if (!(resourceType in Memory.resourceSourceMap)) return;

    // 获取该房间在资源来源表中的索引
    _.pull(Memory.resourceSourceMap[resourceType], this.name);
    // 列表为空了就直接移除
    if (Memory.resourceSourceMap[resourceType].length <= 0) delete Memory.resourceSourceMap[resourceType];
  }

  /**
   * 向本房间添加资源共享任务
   *
   * @param targetRoom 资源发送到的房间
   * @param resourceType 共享资源类型
   * @param amount 共享资源数量
   * @returns 是否成功添加
   */
  public shareAdd(targetRoom: string, resourceType: ResourceConstant, amount: number): boolean {
    if (this.memory.shareTask || !this.terminal) return false;
    // 如果是能量的话就把来源建筑设为 storage，这里做了个兜底，如果 storage 没了就检查 terminal 里的能量
    const sourceStructure = resourceType === RESOURCE_ENERGY ? this.storage || this.terminal : this.terminal;
    // 终端能发送的最大数量（路费以最大发送量计算）
    const freeSpace =
      this.terminal.store.getFreeCapacity() - Game.market.calcTransactionCost(amount, this.name, targetRoom);
    // 期望发送量、当前存量、能发送的最大数量中找最小的
    const sendAmount = Math.min(amount, sourceStructure.store[resourceType], freeSpace);

    this.memory.shareTask = {
      target: targetRoom,
      resourceType,
      amount: sendAmount
    };
    return true;
  }

  /**
   * 根据资源类型查找来源房间
   *
   * @param resourceType 要查找的资源类型
   * @param amount 请求的数量
   * @returns 找到的目标房间，没找到返回 null
   */
  private shareGetSource(resourceType: ResourceConstant): Room | null {
    // 兜底
    if (!Memory.resourceSourceMap) {
      Memory.resourceSourceMap = {};
      return null;
    }
    const SourceRoomsName = Memory.resourceSourceMap[resourceType];
    if (!SourceRoomsName) return null;

    // 寻找合适的房间
    let targetRoom: Room = null;
    // 变量房间名数组，注意，这里会把所有无法访问的房间筛选出来
    const roomWithEmpty = SourceRoomsName.map(roomName => {
      const room = Game.rooms[roomName];

      if (!room || !room.terminal) return "";
      // 该房间有任务或者就是自己，不能作为共享来源
      if (room.memory.shareTask || room.name === this.name) return roomName;

      // 如果请求共享的是能量
      if (resourceType === RESOURCE_ENERGY) {
        if (!room.storage) return "";
        // 该房间 storage 中能量低于要求的话，就从资源提供列表中移除该房间
        if (room.storage.store[RESOURCE_ENERGY] < ENERGY_SHARE_LIMIT) return "";
      } else {
        // 如果请求的资源已经没有的话就暂时跳过（因为无法确定之后是否永远无法提供该资源）
        if ((room.terminal.store[resourceType] || 0) <= 0) return roomName;
      }

      // 接受任务的房间就是你了！
      targetRoom = room;
      return roomName;
    });

    // 把上面筛选出来的空字符串元素去除
    Memory.resourceSourceMap[resourceType] = roomWithEmpty.filter(roomName => roomName);
    return targetRoom;
  }

  /**
   * 执行自动建筑规划
   */
  public planLayout(): string {
    const result = planLayout(this);

    if (result === OK) return `自动规划完成`;
    else if (result === ERR_NOT_OWNER) return `自动规划失败，房间没有控制权限`;
    else return `未找到基地中心点位，请执行 Game.rooms.${this.name}.setcenter 以启用自动规划`;
  }

  // 移除不必要的建筑
  public clearStructure(): OK | ERR_NOT_FOUND {
    return clearStructure(this);
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
}
