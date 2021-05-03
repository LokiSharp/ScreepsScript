/**
 * 统一获取 creep 名称
 * 项目中想要获取某个 creep 的名字必须通过这里获取
 */
export class GetName {
  public static harvester = (roomName: string, index: number): string => `${roomName} harvester${index}`;
  public static worker = (roomName: string, index: number): string => `${roomName} worker${index}`;
  public static manager = (roomName: string, index: number): string => `${roomName} manager${index}`;
  public static processor = (roomName: string): string => `${roomName} processor`;
  public static claimer = (targetRoomName: string): string => `${targetRoomName} claimer`;
  public static reserver = (targetRoomName: string): string => `${targetRoomName} reserver`;
  public static signer = (roomName: string): string => `${roomName} signer`;
  public static remoteBuilder = (remoteRoomName: string): string => `${remoteRoomName} RemoteBuilder`;
  public static remoteUpgrader = (remoteRoomName: string): string => `${remoteRoomName} RemoteUpgrader`;
  public static remoteHarvester = (remoteRoomName: string, index: number): string =>
    `${remoteRoomName} remoteHarvester${index}`;
  public static depositHarvester = (flagName: string): string => `${flagName} depoHarvester`;
  public static pbAttacker = (flagName: string, index: number): string => `${flagName} attacker${index}`;
  public static pbHealer = (flagName: string, index: number): string => `${flagName} healer${index}`;
  public static pbCarrier = (flagName: string, index: number): string => `${flagName} carrier${index}`;
  public static reiver = (roomName: string): string => `${roomName} reiver ${Game.time}`;
  public static attacker = (roomName: string, index: number): string => `${roomName} attacker ${Game.time}-${index}`;
  public static boostHealer = (roomName: string): string => `${roomName} healer ${Game.time}`;
  public static dismantler = (roomName: string, index: number): string =>
    `${roomName} dismantler ${Game.time}-${index}`;
  public static rangedAttacker = (roomName: string, index: number): string =>
    `${roomName} rangedAttacker ${Game.time}-${index}`;
  public static boostDismantler = (roomName: string): string => `${roomName} dismantler ${Game.time}`;
  public static boostRangedAttacker = (roomName: string): string => `${roomName} boostRangedAttacker ${Game.time}`;
  public static defender = (roomName: string): string => `${roomName} defender`;
  public static scout = (roomName: string, index: number): string => `${roomName} scout ${index}`;
}
