import { Move } from "@/modules/move";

export default function (): string {
  const routeNames = Object.keys(Move.routeCache);
  if (routeNames.length <= 0) return `暂无路径缓存`;

  const logs = routeNames.map(routeKey => {
    return `[${routeKey.split(" ").join(" > ")}] ${Move.routeCache[routeKey]}`;
  });

  if (logs.length > 0) {
    logs.unshift(`当前共缓存路径 ${routeNames.length} 条`);
  } else return `暂无路径缓存`;

  return logs.join("\n");
}
