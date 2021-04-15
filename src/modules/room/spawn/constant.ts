// 用于维持房间能量正常运转的重要角色
export const importantRoles: CreepRoleConstant[] = ["harvester", "manager", "processor"];

// creep 的默认内存
export const creepDefaultMemory: CreepMemory = {
  data: undefined,

  role: "worker",
  ready: false,
  setWayPoint: false,
  inPlace: false,
  working: false,
  spawnRoom: ""
};
