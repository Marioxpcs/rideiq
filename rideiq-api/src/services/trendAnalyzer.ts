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

export function getVolatility(provider: string) {
  const data = getHistory(provider);

  if (data.length < 2) {
    return {
      score: 0,
      level: "unknown" as const,
      sample_size: data.length,
    };
  }

  const prices = data.map((d) => d.price);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

  if (avg <= 0) {
    return {
      score: 0,
      level: "unknown" as const,
      sample_size: data.length,
    };
  }

  const variance =
    prices.reduce((acc, p) => acc + Math.pow(p - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avg;

  // Normalize CV into 0-1 range (20%+ treated as very high volatility).
  const normalized = Math.min(1, coefficientOfVariation / 0.2);

  let level: "low" | "moderate" | "high" | "unknown" = "low";
  if (normalized >= 0.67) level = "high";
  else if (normalized >= 0.34) level = "moderate";

  return {
    score: +normalized.toFixed(2),
    level,
    sample_size: data.length,
  };
}
