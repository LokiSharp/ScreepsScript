/**
 * Room 控制台交互
 *
 * 本文件包含了 Room 中用于控制台交互的方法
 */
import { LAB_STATE, ROOM_REMOVE_INTERVAL, labTarget } from "setting";
import RoomExtension from "./RoomExtension";
import colorful from "utils/console/colorful";
import { createElement } from "utils/console/createElement";
import { getName } from "utils/global/getName";
import { manageStructure } from "modules/autoPlanning";
import { setBaseCenter } from "modules/autoPlanning/planBasePos";

export default class RoomConsole extends RoomExtension {
  /**
   * 用户操作 - 执行自动建筑规划
   */
  public planlayout(): string {
    return this.planLayout();
  }

  /**
   * 用户操作 - 拓展新外矿
   *
   */
  public radd(remoteRoomName: string, targetId: Id<StructureWithStore>): string {
    let stats = `[${this.name} 外矿] `;

    const actionResult = this.addRemote(remoteRoomName, targetId);
    if (actionResult === OK) stats += "拓展完成，已发布 remoteHarvester 及 reserver";
    else if (actionResult === ERR_INVALID_TARGET) stats += "拓展失败，无效的 targetId";
    else if (actionResult === ERR_NOT_FOUND)
      stats += `拓展失败，未找到 source 旗帜，请在外矿房间的 source 上放置名为 [${remoteRoomName} source0] 的旗帜（有多个 source 请依次增加旗帜名最后一位的编号）`;

    return stats;
  }

  /**
   * 用户操作 - 移除外矿
   *
   * @param 同上 removeRemote()
   */
  public rremove(remoteRoomName: string, removeFlag = false): string {
    let stats = `[${this.name} 外矿] `;

    const actionResult = this.removeRemote(remoteRoomName, removeFlag);
    if (actionResult === OK)
      stats += "外矿及对应角色组已移除，" + (removeFlag ? "source 旗帜也被移除" : "source 旗帜未移除");
    else if (actionResult === ERR_NOT_FOUND) stats += "未找到对应外矿";

    return stats;
  }

  /**
   * 用户操作 - 占领新房间
   *
   * @param 同上 claimRoom()
   */
  public claim(targetRoomName: string, signText = ""): string {
    this.claimRoom(targetRoomName, signText);

    return `[${
      this.name
    } 拓展] 已发布 claimer，请保持关注，支援单位会在占领成功后自动发布。\n 你可以在目标房间中新建名为 ${getName.flagBaseCenter(
      targetRoomName
    )} 的旗帜来指定基地中心。否则 claimer 将运行自动规划。`;
  }

  /**
   * 用户操作 - 设置中心点
   * @param flagName 中心点旗帜名
   */
  public setcenter(flagName: string): string {
    if (!flagName) flagName = getName.flagBaseCenter(this.name);
    const flag = Game.flags[flagName];

    if (!flag) return `[${this.name}] 未找到名为 ${flagName} 的旗帜`;

    setBaseCenter(this, flag.pos);
    flag.remove();
    // 设置好了之后自动运行布局规划
    manageStructure(this);
    return `[${this.name}] 已将 ${flagName} 设置为中心点，controller 升级时自动执行布局规划`;
  }

  /**
   * 用户操作：addCenterTask - 添加中央运输任务
   *
   * @param targetId 资源存放建筑类型
   * @param sourceId 资源来源建筑类型
   * @param resourceType 要转移的资源类型
   * @param amount 资源数量
   */
  public ctadd(
    target: CenterStructures,
    source: CenterStructures,
    resourceType: ResourceConstant,
    amount: number
  ): string {
    if (!this.memory.centerTransferTasks) this.memory.centerTransferTasks = [];
    const addResult = this.addCenterTask({
      submit: this.memory.centerTransferTasks.length,
      target,
      source,
      resourceType,
      amount
    });
    return `已向 ${this.name} 中央任务队列推送任务，当前排队位置: ${addResult}`;
  }

  /**
   * 用户操作：将能量从 storage 转移至 terminal 里
   *
   * @param amount 要转移的能量数量, 默认 100k
   */
  public pute(amount = 100000): string {
    const addResult = this.addCenterTask({
      submit: this.memory.centerTransferTasks.length,
      target: STRUCTURE_TERMINAL,
      source: STRUCTURE_STORAGE,
      resourceType: RESOURCE_ENERGY,
      amount
    });
    return `已向 ${this.name} 中央任务队列推送能量转移任务，storage > terminal, 数量 ${amount}，当前排队位置: ${addResult}`;
  }

  /**
   * 用户操作：将能量从 terminal 转移至 storage 里
   *
   * @param amount 要转移的能量数量, 默认全部转回来
   */
  public gete(amount: number = null): string {
    if (!this.terminal) return `未找到 ${this.name} 中的终端`;
    if (amount === null) amount = this.terminal.store[RESOURCE_ENERGY];

    const addResult = this.addCenterTask({
      submit: this.memory.centerTransferTasks.length,
      target: STRUCTURE_STORAGE,
      source: STRUCTURE_TERMINAL,
      resourceType: RESOURCE_ENERGY,
      amount
    });
    return `已向 ${this.name} 中央任务队列推送能量转移任务，terminal > storage, 数量 ${amount}，当前排队位置: ${addResult}`;
  }

  /**
   * 用户操作：向指定房间发送能量
   * 注意，该操作会自动从 storage 里取出能量
   *
   * @param roomName 目标房间名
   * @param amount 要发送的数量, 默认 100k
   */
  public givee(roomName: string, amount = 100000): string {
    const logs = [];
    if (!this.terminal) return `[能量共享] 未发现 Terminal，共享终止`;
    // 如果在执行其他任务则将其覆盖，因为相对于用户操作来说，其他模块发布的资源共享任务优先级肯定要低
    // 并且其他模块的共享任务就算被删除了，过一段时间之后它也会再次发布并重新添加
    if (this.memory.shareTask) {
      const task = this.memory.shareTask;
      logs.push(
        `┖─ 因此移除的共享任务为: 目标房间：${task.target} 资源类型：${task.resourceType} 资源总量：${task.amount}`
      );
    }

    // 计算路费，防止出现路费 + 资源超过终端上限的问题出现
    const cost = Game.market.calcTransactionCost(amount, this.name, roomName);
    if (amount + cost - this.terminal.store[RESOURCE_ENERGY] > this.terminal.store.getFreeCapacity()) {
      return `[能量共享] 添加共享任务失败，资源总量超出终端上限：发送数量(${amount}) + 路费(${cost}) = ${
        amount + cost
      } Terminal 剩余容量 ${this.terminal.store.getFreeCapacity()}`;
    }

    this.memory.shareTask = {
      target: roomName,
      amount,
      resourceType: RESOURCE_ENERGY
    };

    logs.unshift(`[能量共享] 任务已添加，移交终端处理：房间名：${roomName} 共享数量：${amount} 路费：${cost}`);

    return logs.join("\n");
  }

  /**
   * 用户操作 - 发送 power 到指定房间
   *
   * @param RoomName 要发送到的房间名
   * @param amount 发送的数量
   */
  public givep(RoomName: string, amount = 5000): string {
    return this.giver(RoomName, RESOURCE_POWER, amount);
  }

  /**
   * 移除房间
   * 第一次执行时将会弹出警告
   * 玩家需要在指定时间内重新执行该 api 才会真正执行移除
   */
  public remove(): string {
    let log = "完成移除";
    // 没有发起过移除或者移除过期了，都视为第一次发起移除
    if (!this.memory.removeTime || Game.time > this.memory.removeTime + ROOM_REMOVE_INTERVAL) {
      log = [
        `${colorful("警告!", "red", true)} 你正在试图移除房间 ${this.name}，这将会导致以下行为的发生：\n`,
        `- 移除所有建筑（不包括 wall、rempart、terminal 和 storage）`,
        `- 移除所有相关 creep 及配置项（以 ${this.name} 作为名称前缀的 creep）`,
        `- 移除所有相关 memory（工作内存及统计内存）`,
        `- ${colorful("不会", undefined, true)}转移房间中存放的资源，需要提前手动转移`,
        `\n在 ${ROOM_REMOVE_INTERVAL.toString()} tick 内重新执行 ${colorful(
          this.name + ".remove()",
          "red"
        )} 以确认移除，执行 ${colorful(this.name + ".cancelremove()", "yellow")} 来取消操作`
      ].join("\n");
      this.memory.removeTime = Game.time;
    } else this.dangerousRemove();
    return log;
  }

  /**
   * 取消移除房间
   */
  public cancelremove(): string {
    delete this.memory.removeTime;
    return `移除操作已取消`;
  }

  /**
   * 用户操作 - 成交订单
   *
   * @param id 交易的订单 id
   * @param amount 交易的数量，默认为最大值
   */
  public deal(id: string, amount: number): string {
    if (!amount) {
      const order = Game.market.getOrderById(id);
      if (!order) return `[${this.name}] 订单 ${id} 不存在`;

      amount = order.amount;
    }

    const actionResult = Game.market.deal(id, amount, this.name);

    if (actionResult === OK) return `[${this.name}] 交易成功`;
    else return `[${this.name}] 交易异常，Game.market.deal 返回值 ${actionResult}`;
  }

  /**
   * 用户操作：向指定房间发送资源
   * 注意，请保证资源就在 Terminal 中
   *
   * @param roomName 目标房间名
   * @param resourceType 要共享的资源类型
   * @param amount 要发送的数量, 默认 100k
   */
  public giver(roomName: string, resourceType: ResourceConstant, amount = 1000): string {
    const logs = [];
    // 如果在执行其他任务则将其覆盖，因为相对于用户操作来说，其他模块发布的资源共享任务优先级肯定要低
    // 并且其他模块的共享任务就算被删除了，过一段时间之后它也会再次发布并重新添加
    if (this.memory.shareTask) {
      const task = this.memory.shareTask;
      logs.push(
        `┖─ 因此移除的共享任务为: 目标房间：${task.target} 资源类型：${task.resourceType} 资源总量：${task.amount}`
      );
    }

    // 检查资源是否足够
    if (!this.terminal) return `[资源共享] 该房间没有终端`;
    const resourceAmount = this.terminal.store[resourceType];
    if (!resourceAmount || resourceAmount < amount)
      return `[资源共享] 数量不足 ${resourceType} 剩余 ${resourceAmount || 0}`;

    // 计算路费，防止出现路费 + 资源超过终端上限的问题出现
    const cost = Game.market.calcTransactionCost(amount, this.name, roomName);
    if (amount + cost > TERMINAL_CAPACITY) {
      return `[资源共享] 添加共享任务失败，资源总量超出终端上限：发送数量(${amount}) + 路费(${cost}) = ${
        amount + cost
      }`;
    }

    this.memory.shareTask = {
      target: roomName,
      amount,
      resourceType
    };

    logs.unshift(`[资源共享] 任务已添加，移交终端处理：房间名：${roomName} 共享数量：${amount} 路费：${cost}`);

    return logs.join("\n");
  }

  /**
   * 可视化用户操作 - 添加终端监听任务
   */
  public tadd(): string {
    return createElement.form(
      "terminalAdd",
      [
        { name: "resourceType", label: "资源类型", type: "input", placeholder: "资源的实际值" },
        { name: "amount", label: "期望值", type: "input", placeholder: "交易策略的触发值" },
        { name: "priceLimit", label: "[可选]价格限制", type: "input", placeholder: "置空该值以启动价格检查" },
        {
          name: "mod",
          label: "物流方向",
          type: "select",
          options: [
            { value: 0, label: "获取" },
            { value: 1, label: "提供" }
          ]
        },
        {
          name: "channel",
          label: "物流渠道",
          type: "select",
          options: [
            { value: 0, label: "拍单" },
            { value: 1, label: "挂单" },
            { value: 2, label: "共享" },
            { value: 3, label: "支援" }
          ]
        },
        { name: "supportRoomName", label: "[可选]支援房间", type: "input", placeholder: "channel 为支援时必填" }
      ],
      {
        content: "提交",
        command: `({resourceType, amount, mod, channel, priceLimit, supportRoomName}) => Game.rooms['${this.name}'].terminal.add(resourceType, amount, mod, channel, priceLimit, supportRoomName)`
      }
    );
  }

  /**
   * 用户操作：addTerminalTask
   */
  public ta(
    resourceType: ResourceConstant,
    amount: number,
    mod: TerminalModes = 0,
    channel: TerminalChannels = 0,
    priceLimit: number = undefined
  ): string {
    if (!this.terminal) return `[${this.name}] 未找到终端`;

    return this.terminal.add(resourceType, amount, mod, channel, priceLimit);
  }

  /**
   * 用户操作：removeTerminalTask
   */
  public tr(index: number): string {
    if (!this.terminal) return `[${this.name}] 未找到终端`;

    return this.terminal.remove(index);
  }

  /**
   * 用户操作：showTerminalTask
   */
  public ts(): string {
    if (!this.terminal) return `[${this.name}] 未找到终端`;

    return this.terminal.show();
  }

  /**
   * 用户操作：初始化 lab 集群
   * 要提前放好名字为 lab1 和 lab2 的两个旗帜（放在集群中间的两个 lab 上）
   */
  public linit(): string {
    /**
     * 获取旗帜及兜底
     * @danger 这里包含魔法常量，若有需要应改写成数组形式
     */
    const lab1Flag = Game.flags.lab1;
    const lab2Flag = Game.flags.lab2;
    if (!lab1Flag || !lab2Flag) return `[lab 集群] 初始化失败，请新建名为 [lab1] 和 [lab2] 的旗帜`;
    if (lab1Flag.pos.roomName !== this.name || lab2Flag.pos.roomName !== this.name)
      return `[lab 集群] 初始化失败，旗帜不在本房间内，请进行检查`;

    // 初始化内存, 之前有就刷新 id 缓存，没有就新建
    if (this.memory.lab) {
      this.memory.lab.inLab = [];
      this.memory.lab.outLab = {};
    } else {
      this.memory.lab = {
        state: "getTarget",
        targetIndex: 1,
        inLab: [],
        outLab: {},
        pause: false
      };
    }

    // 获取并分配 lab
    const labs = this.find<StructureLab>(FIND_MY_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_LAB
    });
    labs.forEach(lab => {
      if (lab.pos.isEqualTo(lab1Flag.pos) || lab.pos.isEqualTo(lab2Flag.pos)) this.memory.lab.inLab.push(lab.id);
      else this.memory.lab.outLab[lab.id] = 0;
    });

    lab1Flag.remove();
    lab2Flag.remove();

    return `[${this.name} lab] 初始化成功`;
  }

  /**
   * 用户操作：暂停 lab 集群
   */
  public loff(): string {
    if (!this.memory.lab) return `[${this.name} lab] 集群尚未初始化`;
    this.memory.lab.pause = true;
    return `[${this.name} lab] 已暂停工作`;
  }

  /**
   * 用户操作：重启 lab 集群
   */
  public lon(): string {
    if (!this.memory.lab) return `[${this.name} lab] 集群尚未初始化`;
    this.memory.lab.pause = false;
    return `[${this.name} lab] 已恢复工作`;
  }

  /**
   * 用户操作：显示当前 lab 状态
   */
  public lshow(): string {
    const memory = this.memory.lab;
    if (!memory) return `[${this.name}] 未启用 lab 集群`;
    const logs = [`[${this.name}]`];

    if (memory.pause) logs.push(colorful("暂停中", "yellow"));
    logs.push(`[状态] ${memory.state}`);

    // 获取当前目标产物以及 terminal 中的数量
    const res = labTarget[memory.targetIndex];
    const currentAmount = this.terminal ? this.terminal.store[res.target] : colorful("无法访问 terminal", "red");

    // 在工作就显示工作状态
    if (memory.state === LAB_STATE.WORKING) {
      logs.push(
        `[工作进程] 目标 ${res.target} 剩余生产/当前存量/目标存量 ${memory.targetAmount}/${currentAmount}/${res.targetNumber}`
      );
    }
    // 做完了就显示总数
    else if (memory.state === LAB_STATE.PUT_RESOURCE) {
      logs.push(`正在将 ${res.target} 转移至 terminal，数量：${Object.values(memory.outLab).reduce((p, n) => p + n)}`);
    }

    return logs.join(" ");
  }

  /**
   * 用户操作 - 启动战争状态
   */
  public war(): string {
    let stats = `[${this.name}] `;
    const result = this.startWar("WAR");

    if (result === OK) stats += `已启动战争状态，正在准备 boost 材料，请在准备完成后再发布角色组`;
    else if (result === ERR_NAME_EXISTS) stats += "已处于战争状态";
    else if (result === ERR_NOT_FOUND)
      stats += `未找到名为 [${this.name}Boost] 的旗帜，请保证其周围有足够数量的 lab（至少 6 个）`;
    else if (result === ERR_INVALID_TARGET) stats += "旗帜周围的 lab 数量不足，请移动旗帜位置";

    return stats;
  }

  /**
   * 用户操作 - 取消战争状态
   */
  public nowar(): string {
    let stats = `[${this.name}] `;
    const result = this.stopWar();

    if (result === OK) stats += `已解除战争状态，boost 强化材料会依次运回 Terminal`;
    else if (result === ERR_NOT_FOUND) stats += `未启动战争状态`;

    return stats;
  }

  /**
   * 创建订单并返回创建信息
   *
   * @param type 订单类型
   * @param resourceType 资源类型
   * @param price 单价
   * @param totalAmount 总量
   */
  private createOrder(
    type: ORDER_BUY | ORDER_SELL,
    resourceType: ResourceConstant,
    price: number,
    totalAmount: number
  ): string {
    const orderConfig = {
      type,
      resourceType,
      price,
      totalAmount,
      roomName: this.name
    };
    const createResult = Game.market.createOrder(orderConfig);

    let returnString = "";
    // 新创建的订单下个 tick 才能看到，所以这里只能让玩家自行查看
    if (createResult === OK)
      returnString = `[${this.name}] ${type} 订单创建成功，使用如下命令来查询新订单:\n   JSON.stringify(_.find(Object.values(Game.market.orders),{type:'${type}',resourceType:'${resourceType}',price:${price},roomName:'${this.name}'}), null, 4)`;
    else if (createResult === ERR_NOT_ENOUGH_RESOURCES)
      returnString = `[${this.name}] 您没有足够的 credit 来缴纳费用，当前/需要 ${Game.market.credits}/${
        price * totalAmount * 0.05
      }`;
    else returnString = `[${this.name}] 创建失败，Game.market.createOrder 错误码: ${createResult}`;

    return returnString;
  }

  /**
   * 为该房间创建一个 ORDER_BUY 订单
   *
   * @param resourceType 资源类型
   * @param price 单价
   * @param amount 总量
   */
  public buy(resourceType: ResourceConstant, price: number, totalAmount: number): string {
    return this.createOrder(ORDER_BUY, resourceType, price, totalAmount);
  }

  /**
   * 为该房间创建一个 ORDER_SELL 订单
   *
   * @param resourceType 资源类型
   * @param price 单价
   * @param amount 总量
   */
  public sell(resourceType: ResourceConstant, price: number, totalAmount: number): string {
    return this.createOrder(ORDER_SELL, resourceType, price, totalAmount);
  }

  /**
   * 移除所有不属于自己的墙壁
   */
  public clearwall(): string {
    // 找到所有不是自己的墙壁
    const wall = this.find(FIND_STRUCTURES, {
      filter: s => s.structureType === STRUCTURE_WALL || (s.structureType === STRUCTURE_RAMPART && !s.my)
    });
    if (wall.length <= 0) return `[${this.name}] 未找到墙壁`;

    wall.forEach(w => w.destroy());
    return `[${this.name}] 墙壁清理完成`;
  }
}
