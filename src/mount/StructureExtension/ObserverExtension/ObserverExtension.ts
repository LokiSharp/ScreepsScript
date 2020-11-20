import { DEPOSIT_MAX_COOLDOWN, OBSERVER_DEPOSIT_MAX, OBSERVER_POWERBANK_MAX, observerInterval } from "setting";
import { checkAliveFlag } from "utils/global/checkAliveFlag";
import { creepApi } from "modules/creepController/creepApi";

/**
 * Observer 拓展
 * 定期搜索给定列表中的房间并插旗
 */
export default class ObserverExtension extends StructureObserver {
  public work(): void {
    const memory = this.room.memory.observer;
    // 没有初始化或者暂停了就不执行工作
    if (!memory) return;
    if (memory.pause) return;
    // 都找到上限就不继续工作了
    if (memory.pbList.length >= OBSERVER_POWERBANK_MAX && memory.depoList.length >= OBSERVER_DEPOSIT_MAX) return;

    // 如果房间没有视野就获取视野，否则就执行搜索
    if (this.room.memory.observer.checkRoomName) this.searchRoom();
    else this.obRoom();

    // 每隔一段时间检查下是否有 flag 需要清理
    if (!(Game.time % 30)) this.updateFlagList();
  }

  /**
   * 在房间内执行搜索
   * 该方法会搜索房间中的 deposits 和 power bank，一旦发现自动插旗
   */
  private searchRoom(): void {
    // 从内存中获取要搜索的房间
    const memory = this.room.memory.observer;
    const room = Game.rooms[memory.checkRoomName];
    // 兜底
    if (!room) {
      delete this.room.memory.observer.checkRoomName;
      return;
    }
    // this.log(`搜索房间 ${room.name}`)

    // 还没插旗的话就继续查找 deposit
    if (memory.depoList.length < OBSERVER_DEPOSIT_MAX) {
      const deposits = room.find(FIND_DEPOSITS);
      // 对找到的 deposit 进行处置归档
      deposits.forEach(deposit => {
        // 冷却过长或者已经插旗的忽略
        if (deposit.lastCooldown >= DEPOSIT_MAX_COOLDOWN) return;
        const flags = deposit.pos.lookFor(LOOK_FLAGS);
        if (flags.length > 0) return;

        // 确认完成，插旗
        this.newHarvesteTask(deposit);
        this.log(`${this.room.memory.observer.checkRoomName} 检测到新 deposit, 已插旗`, "green");
      });
    }

    // 还没插旗的话就继续查找 pb
    if (memory.pbList.length < OBSERVER_POWERBANK_MAX) {
      // pb 的存活时间大于 3000 / power 足够大的才去采集
      const powerBanks = room.find<StructurePowerBank>(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_POWER_BANK && s.ticksToDecay >= 3000 && s.power >= 2000
      });
      // 对找到的 pb 进行处置归档
      powerBanks.forEach(powerBank => {
        const flags = powerBank.pos.lookFor(LOOK_FLAGS);
        if (flags.length > 0) return;

        // 确认完成，插旗
        this.newHarvesteTask(powerBank);
        this.log(`${this.room.memory.observer.checkRoomName} 检测到新 pb, 已插旗`, "green");
      });
    }

    // 确认该房间已被搜索
    delete this.room.memory.observer.checkRoomName;
  }

  /**
   * 发布新的采集任务
   * 会自行插旗并发布角色组
   *
   * @param target 要采集的资源
   */
  private newHarvesteTask(target: StructurePowerBank | Deposit): OK | ERR_INVALID_TARGET {
    if (target instanceof StructurePowerBank) {
      const targetFlagName = `${STRUCTURE_POWER_BANK} ${this.room.name} ${Game.time}`;
      target.pos.createFlag(targetFlagName);

      // 更新数量
      this.room.memory.observer.pbList.push(targetFlagName);
      // 计算应该发布的采集小组数量，最高两组
      const groupNumber = target.pos.getFreeSpace().length > 1 ? 2 : 1;

      // 发布 attacker 和 healer，搬运者由 attacker 在后续任务中自行发布
      for (let i = 0; i < groupNumber; i++) {
        const attackerName = `${targetFlagName} attacker${i}`;
        const healerName = `${targetFlagName} healer${i}`;

        // 添加采集小组
        creepApi.add(
          attackerName,
          "pbAttacker",
          {
            sourceFlagName: targetFlagName,
            spawnRoom: this.room.name,
            healerCreepName: healerName
          },
          this.room.name
        );
        creepApi.add(
          healerName,
          "pbHealer",
          {
            creepName: `${targetFlagName} attacker${i}`
          },
          this.room.name
        );
      }
    } else if (target instanceof Deposit) {
      const targetFlagName = `deposit ${this.room.name} ${Game.time}`;
      target.pos.createFlag(targetFlagName);

      // 更新数量
      this.room.memory.observer.depoList.push(targetFlagName);

      // 发布采集者，他会自行完成剩下的工作
      creepApi.add(
        `${targetFlagName} worker`,
        "depositHarvester",
        {
          sourceFlagName: targetFlagName,
          spawnRoom: this.room.name
        },
        this.room.name
      );
    } else return ERR_INVALID_TARGET;

    return OK;
  }

  /**
   * 获取指定房间视野
   */
  private obRoom(): void {
    if (Game.time % observerInterval) return;

    // 执行视野获取
    const roomName = this.room.memory.observer.watchRooms[this.room.memory.observer.watchIndex];
    const obResult = this.observeRoom(roomName);
    // this.log(`ob 房间 ${roomName}`)

    // 标志该房间视野已经获取，可以进行检查
    if (obResult === OK) this.room.memory.observer.checkRoomName = roomName;

    // 设置下一个要查找房间的索引
    this.room.memory.observer.watchIndex =
      this.room.memory.observer.watchIndex < this.room.memory.observer.watchRooms.length - 1
        ? this.room.memory.observer.watchIndex + 1
        : 0;
  }

  /**
   * 初始化 observer
   */
  protected init(): void {
    this.room.memory.observer = {
      watchIndex: 0,
      watchRooms: [],
      pbList: [],
      depoList: []
    };
  }

  /**
   * 检查当前 depo 和 bp 旗帜是否失效
   * 会更新内存中的两个资源对应的 List 字段
   */
  public updateFlagList(): OK | ERR_NOT_FOUND {
    const memory = this.room.memory.observer;
    if (!memory) return ERR_NOT_FOUND;

    this.room.memory.observer.pbList = memory.pbList.filter(checkAliveFlag);
    this.room.memory.observer.depoList = memory.depoList.filter(checkAliveFlag);

    return OK;
  }
}
