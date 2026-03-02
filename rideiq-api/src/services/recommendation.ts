type RideOption = {
  provider: string;
  price: number;
  eta_minutes: number;
  trend?: "rising" | "falling" | "stable" | "unknown";
};

export function scoreRide(ride: RideOption): number {
  let score = ride.price;

  // ⏱ Pickup penalty
  score += ride.eta_minutes * 0.5;

  // 📈 Trend penalty
  if (ride.trend === "rising") score += 3;
  if (ride.trend === "falling") score -= 1;

  return score;
}

export function recommendRide(options: RideOption[]) {
  if (!options.length) return null;

  let best = options[0]!;
  let bestScore = scoreRide(best);

  for (const ride of options.slice(1)) {
    const s = scoreRide(ride);
    if (s < bestScore) {
      best = ride;
      bestScore = s;
    }
  }

  return {
    ...best,
    score: Number(bestScore.toFixed(2)),
  };
}