import { Move, WayPoint } from "@/modules/move";
import { PowerTasks } from "./PowerTasks";
import log from "@/utils/console/log";
import { maxOps } from "@/setting";

/**
 * PowerCreep 原型拓展
 * 遍历自己的 powers，并执行相应任务
 */
export class PowerCreepExtension extends PowerCreep {
  public onWork(): void {
    if (!this.keepAlive()) return;

    // 获取队列中的第一个任务并执行
    // 没有任务的话就搓 ops
    let powerTask = this.room.getPowerTask();

    // 没有任务，并且 ops 不够，就搓 ops
    if (!powerTask && this.room.terminal && this.room.terminal.store[RESOURCE_OPS] < maxOps)
      powerTask = PWR_GENERATE_OPS;
    if (!powerTask) return;

    this.executeTask(powerTask);
  }

  /**
   * 发送日志
   *
   * @param content 日志内容
   * @param color 日志前缀颜色
   * @param notify 是否发送邮件
   */
  public log(content: string, color: Colors = undefined, notify = false): void {
    // 因为 pc 可能未孵化，所以这里需要特别判断一下
    if (!this.room) log(content, [this.name], color, notify);
    else this.room.log(content, this.name, color, notify);
  }

  /**
   * 保证自己一直活着
   *
   * @returns 是否可以执行后面的工作
   */
  private keepAlive(): boolean {
    // pc 是所有 shard 通用的，所以这里需要特判下
    if (this.shard !== Game.shard.name) return false;

    // 快凉了就尝试重生
    if (this.ticksToLive <= 100) {
      // 如果工作房间被更改的话就不进行 renew
      // 等到冷却完成后会自动复活到 workRoom
      if (this.memory.workRoom !== this.room.name) return true;

      this.say("插座在哪！");
      if (this.renewSelf() === OK) return false;
    }
    // 真凉了就尝试生成
    if (!this.ticksToLive) {
      // 还在冷却就等着
      if (!this.spawnCooldownTime) {
        // 请求指定工作房间
        if (!this.memory.workRoom)
          this.log(
            `请使用该命令来指定工作房间（房间名置空以关闭提示）：Game.powerCreeps['${this.name}'].setWorkRoom('roomname')`
          );
        // 或者直接出生在指定房间
        else if (this.memory.workRoom !== "hideTip") this.spawnAtRoom(this.memory.workRoom);
      }

      return false;
    }

    return true;
  }

  /**
   * 处理当前的 power 任务
   */
  private executeTask(task: PowerConstant): void {
    // 没有该 power 就直接移除任务
    if (!this.powers[task]) {
      this.say(`无法处理任务 ${task}`);
      return this.finishTask();
    }
    // 没冷却好就暂时挂起任务
    if (this.powers[task].cooldown > 0) {
      // 任务是搓 ops 的话就不用挂起
      if (task !== PWR_GENERATE_OPS) this.room.hangPowerTask();
      return;
    }

    // 获取任务执行逻辑
    const taskOptioon = PowerTasks[task];
    if (!taskOptioon && task !== PWR_GENERATE_OPS) {
      this.say(`不认识任务 ${task}`);
      this.log(`没有和任务 [${task}] 对应的处理逻辑，任务已移除`, "yellow");
      return this.finishTask();
    }

    // 根据 working 字段觉得是执行 source 还是 target
    // working 的值由上个 tick 执行的 source 或者 target 的返回值决定
    if (this.memory.working === undefined || this.memory.working) {
      const result = taskOptioon.target(this);

      // target 返回 OK 才代表任务完成了
      if (result === OK && task !== PWR_GENERATE_OPS) this.finishTask();
      // target 资源不足了就去执行 source
      else if (result === ERR_NOT_ENOUGH_RESOURCES) this.memory.working = false;
    } else {
      const result = taskOptioon.source(this);

      // source OK 了代表资源获取完成，去执行 target
      if (result === OK) this.memory.working = true;
      // 如果 source 还发现没资源的话就强制执行 ops 生成任务
      // 这里调用了自己，但是由于 PWR_GENERATE_OPS 的 source 阶段永远不会返回 ERR_NOT_ENOUGH_RESOURCES
      // 所以不会产生循环调用
      else if (result === ERR_NOT_ENOUGH_RESOURCES) this.executeTask(PWR_GENERATE_OPS);
    }
  }

  /**
   * 在指定房间生成自己
   *
   * @param roomName 要生成的房间名
   * @returns OK 生成成功
   * @returns ERR_INVALID_ARGS 该房间没有视野
   * @returns ERR_NOT_FOUND 该房间不存在或者其中没有 PowerSpawn
   */
  private spawnAtRoom(roomName: string): OK | ERR_INVALID_ARGS | ERR_NOT_FOUND {
    const targetRoom = Game.rooms[roomName];
    if (!targetRoom || !targetRoom.powerSpawn) {
      this.log(`找不到指定房间或者房间内没有 powerSpawn，请重新指定工作房间`);
      return ERR_NOT_FOUND;
    }

    const spawnResult = this.spawn(targetRoom.powerSpawn);

    if (spawnResult === OK) return OK;
    else {
      this.log(`孵化异常! 错误码: ${spawnResult}`, "yellow");
      return ERR_INVALID_ARGS;
    }
  }

  /**
   * 给 powerCreep 指定工作房间
   *
   * @param roomName 要进行生成的房间名
   */
  public setWorkRoom(roomName = "hideTip"): string {
    let result: string = this.memory.workRoom
      ? `[${this.name}] 已将工作房间从 ${this.memory.workRoom} 重置为 ${roomName}, 将会在老死后复活在目标房间`
      : `[${this.name}] 已将工作房间设置为 ${roomName}`;

    if (roomName === "hideTip") result = `[${this.name}] 已关闭提示，重新执行该命令来孵化此 powerCrep`;

    this.memory.workRoom = roomName;

    return result;
  }

  /**
   * 前往 controller 启用房间中的 power
   *
   * @returns OK 激活完成
   * @returns ERR_BUSY 正在激活中
   */
  public enablePower(): OK | ERR_BUSY {
    this.say("正在启用 Power");

    const result = this.enableRoom(this.room.controller);
    if (result === OK) return OK;
    else if (result === ERR_NOT_IN_RANGE) {
      this.goTo(this.room.controller.pos);
    }
    return ERR_BUSY;
  }

  /**
   * 找到房间中的 powerSpawn renew 自己
   *
   * @returns OK 正在执行 renew
   * @returns ERR_NOT_FOUND 房间内没有 powerSpawn
   */
  private renewSelf(): OK | ERR_NOT_FOUND {
    if (!this.room.powerSpawn) return ERR_NOT_FOUND;

    const result = this.renew(this.room.powerSpawn);

    if (result === ERR_NOT_IN_RANGE) {
      this.goTo(this.room.powerSpawn.pos);
    }

    return OK;
  }

  /**
   * 把自己的 power 能力信息更新到房间
   */
  public updatePowerToRoom(): void {
    const powers = Object.keys(this.powers);
    // 把房间内已有的 powers 取出来并进行去重操作，放置房间内有多个 Pc 时互相覆盖彼此的能力
    const existPowers = this.room.memory.powers ? this.room.memory.powers.split(" ") : [];
    const uniqePowers = _.uniq([...powers, ...existPowers]);

    this.room.memory.powers = uniqePowers.join(" ");
  }

  /**
   * 完成当前任务
   * 会确保下个任务开始时执行 target 阶段
   */
  private finishTask(): void {
    this.memory.working = true;
    this.room.deleteCurrentPowerTask();
  }

  /**
   * 从 terminal 中取出 ops
   *
   * @param opsNumber 要拿取的数量
   * @returns OK 拿取完成
   * @returns ERR_NOT_ENOUGH_RESOURCES 资源不足
   * @returns ERR_BUSY 正在执行任务
   */
  public getOps(opsNumber: number): OK | ERR_NOT_ENOUGH_RESOURCES | ERR_BUSY {
    // 身上的够用就不去 terminal 拿了
    if (this.store[RESOURCE_OPS] > opsNumber) return OK;

    let sourceStructure: StructureTerminal | StructureStorage;
    // 如果资源够的话就使用 terminal 作为目标
    if (this.room.terminal && this.room.terminal.store[RESOURCE_OPS] >= opsNumber) sourceStructure = this.room.terminal;
    else return ERR_NOT_ENOUGH_RESOURCES;

    // 拿取指定数量的 ops
    const actionResult = this.withdraw(sourceStructure, RESOURCE_OPS, opsNumber);

    // 校验
    if (actionResult === OK) return OK;
    else if (actionResult === ERR_NOT_IN_RANGE) {
      this.goTo(sourceStructure.pos);
      return ERR_BUSY;
    } else {
      this.log(`执行 getOps 时出错，错误码 ${actionResult}`, "yellow");
      return ERR_BUSY;
    }
  }

  /**
   * 以下为对穿移动的相关方法，直接执行 Creep 原型上的对应方法
   */

  public goTo(target?: RoomPosition, moveOpt?: MoveOpt): ScreepsReturnCode {
    return Move.goTo(this, target, moveOpt);
  }

  public setWayPoint(target: string[] | string): ScreepsReturnCode {
    return WayPoint.setWayPoint(this, target);
  }
}
