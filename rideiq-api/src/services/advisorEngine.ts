type RideOption = {
  provider: string;
  price: number;
  eta_minutes: number;
  surge_multiplier: number;
  trend: "rising" | "falling" | "stable" | "unknown";
  volatility_score?: number;
  volatility_level?: "low" | "moderate" | "high" | "unknown";
};

type AdvisorResult = {
  recommendation: "BOOK_NOW" | "WAIT";
  confidence: number;
  reasoning: string;
  expected_savings?: number | undefined;
  volatility_score: number;
  volatility_level: "low" | "moderate" | "high" | "unknown";
};

export function generateAdvisor(
  options: RideOption[],
  bestOption: RideOption
): AdvisorResult {
  const surge = bestOption.surge_multiplier;
  const trend = bestOption.trend;

  // ---------------------------
  // 1️⃣ SURGE SCORE (0–1)
  // ---------------------------
  const surgeScore = Math.min(1, (surge - 1) / 0.8);

  // ---------------------------
  // 2️⃣ TREND SCORE (-1 to 1)
  // ---------------------------
  let trendScore = 0;
  if (trend === "falling") trendScore = 1;
  if (trend === "rising") trendScore = -1;

  // ---------------------------
  // 3️⃣ MARKET VOLATILITY SCORE (cross-provider spread dynamics)
  // ---------------------------
  const prices = options.map(o => o.price);
  const avg =
    prices.reduce((a, b) => a + b, 0) / prices.length;

  const variance =
    prices.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
    prices.length;

  const stdDev = Math.sqrt(variance);
  const marketVolatilityScore = Math.min(1, stdDev / avg);

  // ---------------------------
  // 4️⃣ PROVIDER SPREAD SCORE
  // ---------------------------
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const spreadScore = Math.min(1, (maxPrice - minPrice) / avg);

  // ---------------------------
  // WEIGHTED MODEL
  // ---------------------------
  const providerVolatilityScore =
    typeof bestOption.volatility_score === "number"
      ? bestOption.volatility_score
      : marketVolatilityScore;

  const waitScore =
    surgeScore * 0.35 +
    (trendScore === 1 ? 1 : 0) * 0.25 +
    providerVolatilityScore * 0.25 +
    spreadScore * 0.15;

  const bookScore =
    (trendScore === -1 ? 1 : 0) * 0.35 +
    (surge < 1.15 ? 1 : 0) * 0.3 +
    (providerVolatilityScore < 0.35 ? 1 : 0) * 0.2 +
    (spreadScore < 0.2 ? 1 : 0) * 0.15;

  const recommendation =
    waitScore > bookScore ? "WAIT" : "BOOK_NOW";

  const rawConfidence = Math.abs(waitScore - bookScore);
  const signalStrength =
    (surgeScore + providerVolatilityScore + spreadScore) / 3;
  const confidence = Math.round(
    Math.min(95, Math.max(15, rawConfidence * 75 + signalStrength * 25))
  );

  const expected_savings =
    recommendation === "WAIT"
      ? +(bestOption.price * 0.1).toFixed(2)
      : undefined;

  let reasoning = "";

  if (recommendation === "WAIT") {
    reasoning =
      "Price unstable with elevated surge and fluctuation. Waiting is likely to improve fare.";
  } else {
    reasoning =
      "Current pricing is relatively stable with manageable surge. Booking now is reasonable.";
  }

  const volatilityLevel =
    bestOption.volatility_level ??
    (providerVolatilityScore >= 0.67
      ? "high"
      : providerVolatilityScore >= 0.34
      ? "moderate"
      : "low");

  return {
    recommendation,
    confidence,
    reasoning,
    expected_savings,
    volatility_score: +providerVolatilityScore.toFixed(2),
    volatility_level: volatilityLevel,
  };
}
