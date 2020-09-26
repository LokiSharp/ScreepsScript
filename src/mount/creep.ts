import { assignPrototype } from "utils/prototype";
import roles from "role";

export class CreepExtension extends Creep {
  /**
   * creep 主要工作
   */
  public work(): void {
    // 检查 creep 内存中的角色是否存在
    if (!(this.memory.role in roles)) {
      this.log(`找不到对应的 creepConfig`, "yellow");
      this.say("我凉了！");
      return;
    }

    // 还没出生就啥都不干
    if (this.spawning) {
      // eslint-disable-next-line no-underscore-dangle
      if (this.ticksToLive === CREEP_LIFE_TIME) this._id = this.id; // 解决 this creep not exist 问题
      return;
    }

    // 快死时的处理
    if (this.ticksToLive <= 3) {
      // 如果还在工作，就释放掉自己的工作位置
      if (this.memory.standed) this.room.removeRestrictedPos(this.name);
    }

    // 获取对应配置项
    const creepConfig: ICreepConfig = roles[this.memory.role](this.memory.data);

    // 没准备的时候就执行准备阶段
    if (!this.memory.ready) {
      // 有准备阶段配置则执行
      if (creepConfig.prepare) this.memory.ready = creepConfig.prepare(this);
      // 没有就直接准备完成
      else this.memory.ready = true;
    }

    // 如果执行了 prepare 还没有 ready，就返回等下个 tick 再执行
    if (!this.memory.ready) return;

    // 获取是否工作，没有 source 的话直接执行 target
    const working = creepConfig.source ? this.memory.working : true;

    let stateChange = false;
    // 执行对应阶段
    // 阶段执行结果返回 true 就说明需要更换 working 状态
    if (working) {
      if (creepConfig.target && creepConfig.target(this)) stateChange = true;
    } else {
      if (creepConfig.source && creepConfig.source(this)) stateChange = true;
    }

    // 状态变化了就释放工作位置
    if (stateChange) {
      this.memory.working = !this.memory.working;
      if (this.memory.standed) {
        this.room.removeRestrictedPos(this.name);
        delete this.memory.standed;
      }
    }
  }

  /**
   * 无视 Creep 的寻路
   *
   * @param target 要移动到的位置
   */
  public goTo(target: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND {
    // const baseCost = Game.cpu.getUsed()
    const moveResult = this.moveTo(target, {
      reusePath: 20,
      ignoreCreeps: true
    });

    return moveResult;
  }

  /**
   * 从目标结构获取能量
   *
   * @param target 提供能量的结构
   * @returns 执行 harvest 或 withdraw 后的返回值
   */
  public getEngryFrom(target: Structure | Source): ScreepsReturnCode {
    let result: ScreepsReturnCode;
    // 是建筑就用 withdraw
    if (target instanceof Structure) result = this.withdraw(target, RESOURCE_ENERGY);
    // 不是的话就用 harvest
    else {
      result = this.harvest(target);
    }

    if (result === ERR_NOT_IN_RANGE) this.goTo(target.pos);

    return result;
  }

  /**
   * 转移资源到结构
   *
   * @param target 要转移到的目标
   * @param RESOURCE 要转移的资源类型
   */
  public transferTo(target: Structure, RESOURCE: ResourceConstant): ScreepsReturnCode {
    // 转移能量实现
    this.goTo(target.pos);
    return this.transfer(target, RESOURCE);
  }

  /**
   * 填充本房间的 controller
   */
  public upgrade(): ScreepsReturnCode {
    const result = this.upgradeController(this.room.controller);

    // 如果刚开始站定工作，就把自己的位置设置为禁止通行点
    if (result === OK && !this.memory.standed) {
      this.memory.standed = true;
      this.room.addRestrictedPos(this.name, this.pos);
    } else if (result === ERR_NOT_IN_RANGE) {
      this.goTo(this.room.controller.pos);
    }
    return result;
  }
}

// 挂载拓展到 Creep 原型
export default function (): void {
  assignPrototype(Creep, CreepExtension);
}
