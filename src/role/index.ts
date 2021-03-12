import { attacker } from "./war/attacker";
import { boostAttacker } from "./war/boostAttacker";
import { boostDismantler } from "./war/boostDismantler";
import { boostHealer } from "./war/boostHealer";
import { boostRangedAttacker } from "./war/boostRangedAttacker";
import { buildHelper } from "./remote/buildHelper";
import { claimer } from "./remote/claimer";
import { controllerArracker } from "./war/controllerArracker";
import { defender } from "./war/defender";
import { depositHarvester } from "./remote/depositHarvester";
import { dismantler } from "./war/dismantler";
import { gclUpgrader } from "./remote/gclUpgrader";
import { harvester } from "./base/harvester";
import { healer } from "./war/healer";
import { manager } from "./base/manager";
import { moveTester } from "./remote/moveTester";
import { pbAttacker } from "./remote/pbAttacker";
import { pbCarrier } from "./remote/pbCarrier";
import { pbHealer } from "./remote/pbHealer";
import { processor } from "./base/processor";
import { rangedAttacker } from "./war/rangedAttacker";
import { reClaimer } from "./remote/reClaimer";
import { reiver } from "./remote/reiver";
import { remoteBuilder } from "./remote/remoteBuilder";
import { remoteHarvester } from "./remote/remoteHarvester";
import { remoteUpgrader } from "./remote/remoteUpgrader";
import { reserver } from "./remote/reserver";
import { scout } from "./war/scout";
import { signer } from "./remote/signer";
import { worker } from "./base/worker";

const creepWorks: CreepWork = {
  /**
   * 初级房间运维角色组
   * 包括了在没有 Storage 和 Link 的房间内运维所需的角色
   */
  worker,
  harvester,

  /**
   * 高级房间运营角色组
   * 本角色组包括了有 Storage 和 Link 的房间内运维所需的角色
   */
  manager,
  processor,
  /**
   * 外派角色组
   * 本角色组包括了多房间拓展所需要的角色
   */
  reserver,
  remoteHarvester,
  reiver,
  claimer,
  remoteBuilder,
  remoteUpgrader,
  moveTester,
  signer,
  pbAttacker,
  pbCarrier,
  pbHealer,
  depositHarvester,
  buildHelper,
  gclUpgrader,
  reClaimer,
  /**
   * 战斗角色组
   * 本角色组包括了对外战斗和房间防御所需要的角色
   */
  rangedAttacker,
  attacker,
  defender,
  healer,
  dismantler,
  boostDismantler,
  boostHealer,
  boostAttacker,
  boostRangedAttacker,
  scout,
  controllerArracker
};

/**
 * 导出所有的角色
 */
export default creepWorks;
