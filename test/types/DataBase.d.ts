declare interface DBRoom {
  _id?: string;
  active?: boolean;
  status?: string;
  sourceKeepers?: boolean;
  bus?: boolean;
  depositType?: string;
  nextForceUpdateTime?: number;
}

declare interface DBRoomObject {
  _id?: string;
  room?: string;
  type?: string;
  x?: number;
  y?: number;
  user?: string;
  name?: string;
  energy?: number;
  density?: number;
  attributes?: Record<string, unknown>;
  store?: Record<string, unknown>;
  storeCapacityResource?: Record<string, unknown>;
  hits?: number;
  hitsMax?: number;
  spawning?: unknown;
  notifyWhenAttacked?: boolean;
}

declare interface DBRoomTerrain {
  _id?: string;
  room?: string;
  terrain?: string;
  type?: string;
}

declare interface DBUser {
  _id?: string;
  steam?: { id?: string };
  cpu?: number;
  cpuAvailable?: number;
  registeredDate?: string;
  credits?: number;
  gcl?: number;
  powerExperimentations?: number;
  active?: number;
  blocked?: boolean;
  authTouched?: boolean;
  email?: string;
  username?: string;
  usernameLower?: string;
  badge?: {
    type?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    param?: number;
    flip?: boolean;
  };
  lastUsedCpu?: number;
  lastUsedDirtyTime?: number;
  rooms?: string[];
  password?: string;
  salt?: string;
  lastNotifyDate?: number;
  activeSegments?: number[];
}

declare interface DBUserCode {
  _id?: string;
  user?: string;
  modules?: Record<string, unknown>;
  branch?: string;
  activeWorld?: boolean;
  activeSim?: boolean;
  timestamp?: number;
}

declare interface DBRoomFlag {
  _id?: string;
  data?: string;
  user?: string;
  room?: string;
}

declare interface DBUserNotification {
  _id?: string;
  date?: number;
  message?: string;
  type?: string;
  user?: string;
  count?: number;
}

declare interface DBUserPowerCreep {
  _id?: string;
  name?: string;
  className?: string;
  user?: string;
  level?: number;
  hitsMax?: number;
  store?: Record<string, number>;
  storeCapacity?: number;
  spawnCooldownTime?: number;
  powers?: Record<string, unknown>;
}

declare interface DBUserConsole {
  _id?: string;
  user?: string;
  expression?: string;
  hidden?: boolean;
}

declare interface DBUserMessage {
  _id?: string;
  respondent?: string;
  user?: string;
  date?: Date;
  type?: string;
  text?: string;
  unread?: boolean;
}

declare let DBOps: {
  $eq(a: unknown, b: unknown): boolean;
  // abstract/loose equality
  $aeq(a: unknown, b: unknown): boolean;
  $ne(a: unknown, b: unknown): boolean;
  // date equality / loki abstract equality test
  $dteq(a: unknown, b: unknown): boolean;
  $gt(a: unknown, b: unknown): boolean;
  $gte(a: unknown, b: unknown): boolean;
  $lt(a: unknown, b: unknown): boolean;
  $lte(a: unknown, b: unknown): boolean;
  $between(a: unknown, vals: unknown /* [unknown, unknown]*/): boolean;
  $jgt(a: unknown, b: unknown): boolean;
  $jgte(a: unknown, b: unknown): boolean;
  $jlt(a: unknown, b: unknown): boolean;
  $jlte(a: unknown, b: unknown): boolean;
  $jbetween(a: unknown, vals: unknown /* [unknown, unknown]*/): boolean;
  $in(a: unknown, b: unknown): boolean;
  $nin(a: unknown, b: unknown): boolean;
  $keyin(a: unknown, b: unknown): boolean;
  $nkeyin(a: unknown, b: unknown): boolean;
  $definedin(a: unknown, b: unknown): boolean;
  $undefinedin(a: unknown, b: unknown): boolean;
  $regex(a: unknown, b: unknown): boolean;
  $containsString(a: unknown, b: unknown): boolean;
  $containsNone(a: unknown, b: unknown): boolean;
  $containsunknown(a: unknown, b: unknown): boolean;
  $contains(a: unknown, b: unknown): boolean;
  $type(a: unknown, b: unknown): boolean;
  $finite(a: unknown, b: unknown): boolean;
  $size(a: unknown, b: unknown): boolean;
  $len(a: unknown, b: unknown): boolean;
  $where(a: unknown, b: unknown): boolean;
  $not(a: unknown, b: unknown): boolean;
  $and(a: unknown, b: unknown): boolean;
  $or(a: unknown, b: unknown): boolean;
};
