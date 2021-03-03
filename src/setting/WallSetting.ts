/**
 * RCL 分别在几级时放置外墙
 * 例如 [ 3, 7, 8 ] 代表分别在弟 3、7、8 级时放置第 1（最外层）、2、3 层 rampart
 */
export const LEVEL_BUILD_RAMPART = [4, 7, 8];

// tower 将在几级之后参与刷墙
export const TOWER_FILL_WALL_LEVEL = 6;

// 造好新墙时 builder 会先将墙刷到超过下面值，之后才会去建其他建筑
export const MIN_WALL_HITS = 8000;
// 设置 tower 刷墙上限，避免前期过多刷墙
export const MAX_WALL_HITS = 100000;

// 房间建筑维修需要的设置
export const repairSetting = {
  // 在 tower 的能量高于该值时才会刷墙
  energyLimit: 600,
  // 普通建筑维修的检查间隔
  checkInterval: 4,
  // 墙壁维修的检查间隔
  wallCheckInterval: 3,
  // 墙壁的关注时间
  focusTime: 100
};
