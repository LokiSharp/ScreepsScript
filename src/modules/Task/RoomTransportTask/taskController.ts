import { actions, noTask } from "./actions";
import TaskController from "../BaseTaskController";

/**
 * 搬运工工作时长占比到调整期望的 map
 * 例如工作时长占比为 0.71（71% 的时间都在工作），就会触发 proportion 为 0.7 时对应的 expect 字段
 *
 * @property {} proportion 工作时长占比
 * @property {} expect 对应的期望
 */
export const WORK_PROPORTION_TO_EXPECT = [
  { proportion: 0.9, expect: 2 },
  { proportion: 0.8, expect: 1 },
  { proportion: 0.7, expect: 0 },
  { proportion: 0.4, expect: -1 },
  { proportion: 0, expect: -2 }
];

/**
 * 期望调整的统计下限
 * 因为搬运工调整期望值来源于 totalLifeTime 和 totalWorkTime 的统计数据
 * 当这两个值还太小时会造成期望不够准确
 * 所以在 totalLifeTime 大于该值时才会调整搬运工数量
 */
export const REGULATE_LIMIT = 500;

export default class RoomTransport
  extends TaskController<AllTransportTaskType, AllRoomTransportTask>
  implements InterfaceTransportTaskController {
  /**
   * 本物流对象所处的房间名
   */
  public readonly roomName: string;

  /**
   * 当前正在执行的所有物流任务
   */
  public tasks: TransportTasks[AllTransportTaskType][] = [];

  /**
   * 本房间的搬运工总生命时长
   */
  public totalLifeTime = 0;

  /**
   * 本房间的搬运工总工作时长
   */
  public totalWorkTime = 0;

  /**
   * 构造- 管理指定房间的工作任务
   *
   * @param roomName 要管理任务的房间名
   */
  public constructor(roomName: string) {
    super(roomName, "transport");
  }

  /**
   * 获取应该执行的任务逻辑
   * 获取后请在本 tick 直接执行，不要进行存储
   * 会通过 creep 内存中存储的当前执行任务字段来判断应该执行那个任务
   */
  public getWork(creep: Creep<"manager">): RoomTaskAction {
    this.totalLifeTime += 1;

    const task = this.getUnitTask(creep);
    if (!task) return noTask(creep);
    const actionGenerator: TransportActionGenerator = actions[task.type];

    // 分配完后获取任务执行逻辑
    return actionGenerator(creep, task, this);
  }

  /**
   * 获取当前的搬运工调整期望
   * 返回的整数值代表希望增加（正值）/ 减少（负值）多少搬运工
   * 返回 0 代表不需要调整搬运工数量
   */
  public getExpect(): number {
    // 统计数据还太少，不具备参考性，暂时不调整搬运工数量
    if (this.totalLifeTime < REGULATE_LIMIT) return 0;

    // 工作时长占比从高到底找到期望调整的搬运工数量
    const currentExpect = WORK_PROPORTION_TO_EXPECT.find(opt => {
      return this.totalWorkTime / this.totalLifeTime >= opt.proportion;
    });

    if (currentExpect.expect !== 0) {
      this.totalWorkTime = 0;
      this.totalLifeTime = 0;
    }

    return currentExpect?.expect !== undefined ? currentExpect.expect : -2;
  }

  /**
   * 用于 actions 中 creep 统计工作时长
   */
  public countWorkTime(): void {
    this.totalWorkTime += 1;
  }

  /**
   * 用于 actions 中 creep 统计工作时长
   */
  public deCountWorkTime(): void {
    this.totalWorkTime -= 1;
  }
}
