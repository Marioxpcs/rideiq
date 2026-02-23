import { saveSnapshot } from "./trendStore";
import { getTrend } from "./trendAnalyzer";

export async function getRideEstimates(
  pickup: [number, number],
  destination: [number, number]
) {
  const uberPrice = +(15 + Math.random() * 8).toFixed(2);
  const lyftPrice = +(14 + Math.random() * 8).toFixed(2);

  const uberEta = Math.floor(3 + Math.random() * 8);
  const lyftEta = Math.floor(3 + Math.random() * 8);

  // Save snapshots
  saveSnapshot("Uber", uberPrice, uberEta);
  saveSnapshot("Lyft", lyftPrice, lyftEta);

  const results = [
    {
      provider: "Uber",
      price: uberPrice,
      eta_minutes: uberEta,
      currency: "USD",
      trend: getTrend("Uber"),
    },
    {
      provider: "Lyft",
      price: lyftPrice,
      eta_minutes: lyftEta,
      currency: "USD",
      trend: getTrend("Lyft"),
    },
  ];

  return {
    timestamp: new Date().toISOString(),
    pickup,
    destination,
    options: results,
  };
}