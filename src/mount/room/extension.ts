import { createRoomLink } from "utils/createRoomLink";
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
}
