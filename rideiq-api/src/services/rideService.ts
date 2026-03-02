import { getSurgeMultiplier } from "./surgeModel";
import { getHistory, saveSnapshot } from "./trendStore";
import { getTrend, getVolatility } from "./trendAnalyzer";
import { recommendRide } from "./recommendation";
import { getDistance } from "geolib";
import { generateAdvisor } from "./advisorEngine";

export async function getRideEstimates(
  pickup: [number, number],
  destination: [number, number]
) {
  const distanceMeters = getDistance(
  { latitude: pickup[0], longitude: pickup[1] },
  { latitude: destination[0], longitude: destination[1] }
);

const distanceKm = distanceMeters / 1000;
console.log("Pickup coords:", pickup);
console.log("Destination coords:", destination);
console.log("Distance km:", distanceKm);
// Pricing model
// Base pricing
const baseFare = 3;
let perKm;

if (distanceKm < 10) perKm = 1.6;
else if (distanceKm < 50) perKm = 1.2;
else perKm = 0.9;

// Provider base multipliers
const uberBase = 1.15 + Math.random() * 0.05;
const lyftBase = 1.05 + Math.random() * 0.05;

// 🔥 Surge multipliers
const uberSurge = getSurgeMultiplier("Uber");
const lyftSurge = getSurgeMultiplier("Lyft");

const uberPrice = +(
  (baseFare + distanceKm * perKm * uberBase) *
  uberSurge
).toFixed(2);

const lyftPrice = +(
  (baseFare + distanceKm * perKm * lyftBase) *
  lyftSurge
).toFixed(2);
// Trip speed estimate
const avgSpeedKmPerMin = 0.7; // ~42 km/h

// Pickup ETA model
const avgDriverDistanceKm = Math.max(1, Math.min(8, distanceKm * 0.05));
const avgPickupSpeedKmPerMin = 0.6;

const basePickupEta = Math.round(
  avgDriverDistanceKm / avgPickupSpeedKmPerMin
);

const uberEta = basePickupEta + Math.floor(Math.random() * 3);
const lyftEta = basePickupEta + Math.floor(Math.random() * 3);

  // Save snapshots
  saveSnapshot("Uber", uberPrice, uberEta);
  saveSnapshot("Lyft", lyftPrice, lyftEta);

  const uberTrend = getTrend("Uber") as "unknown" | "rising" | "falling" | "stable";
  const lyftTrend = getTrend("Lyft") as "unknown" | "rising" | "falling" | "stable";
  const uberVolatility = getVolatility("Uber");
  const lyftVolatility = getVolatility("Lyft");
  const uberHistory = getHistory("Uber");
  const lyftHistory = getHistory("Lyft");

  const results = [
    {
      provider: "Uber",
      price: uberPrice,
      eta_minutes: uberEta,
      currency: "CAD",
      surge_multiplier: uberSurge,
      trend: uberTrend,
      volatility_score: uberVolatility.score,
      volatility_level: uberVolatility.level,
      recent_prices: uberHistory.map((snapshot) => snapshot.price),
    },
    {
      provider: "Lyft",
      price: lyftPrice,
      eta_minutes: lyftEta,
      currency: "CAD",
      surge_multiplier: lyftSurge,
      trend: lyftTrend,
      volatility_score: lyftVolatility.score,
      volatility_level: lyftVolatility.level,
      recent_prices: lyftHistory.map((snapshot) => snapshot.price),
    },
  ];

  const bestOption = recommendRide(results);

  if (bestOption === null) {
    return {
      timestamp: new Date().toISOString(),
      pickup,
      destination,
      options: results,
      best_option: null,
      advisor: "no available rides",
    };
  }

  const fullBestOption = results.find((r) => r.provider === bestOption.provider) ?? results[0]!;
  const advisor = generateAdvisor(results, fullBestOption);

  return {
    timestamp: new Date().toISOString(),
    pickup,
    destination,
    options: results,
    best_option: bestOption,
    advisor,
  };
}
