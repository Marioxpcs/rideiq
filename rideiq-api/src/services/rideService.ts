import { getSurgeMultiplier } from "./surgeModel";
import { saveSnapshot } from "./trendStore";
import { getTrend } from "./trendAnalyzer";
import { recommendRide } from "./recommendation";
import { getDistance } from "geolib";
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

  const results = [
   {
  provider: "Uber",
  price: uberPrice,
  eta_minutes: uberEta,
  currency: "CAD",
  surge_multiplier: uberSurge,
  trend: getTrend("Uber") as "unknown" | "rising" | "falling" | "stable"
},
    {
  provider: "Lyft",
  price: lyftPrice,
  eta_minutes: lyftEta,
  currency: "CAD",
  surge_multiplier: lyftSurge,
  trend: getTrend("Lyft") as "unknown" | "rising" | "falling" | "stable"
},
  ];

  const bestOption = recommendRide(results);

  // Save snapshots
  saveSnapshot("Uber", uberPrice, uberEta);
  saveSnapshot("Lyft", lyftPrice, lyftEta);

return {
  timestamp: new Date().toISOString(),
  pickup,
  destination,
  options: results,
  best_option: bestOption
};
}