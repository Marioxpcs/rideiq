import { getHistory } from "./trendStore";

export function getTrend(provider: string) {
  const data = getHistory(provider);

  if (data.length < 2) return "unknown";

  const first = data[0]?.price;
  const last = data[data.length - 1]?.price;

  if (first === undefined || last === undefined) return "unknown";

  const diff = last - first;

  if (diff > 1) return "rising";
  if (diff < -1) return "falling";
  return "stable";
}