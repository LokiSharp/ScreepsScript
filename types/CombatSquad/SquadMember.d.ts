// 小队成员对象，键为小队成员在小队内存中的键，值为其本人，常用作参数
interface SquadMember {
  [memberName: string]: Creep;
}
