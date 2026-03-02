export function getSurgeMultiplier(provider: string): number {
  const hour = new Date().getHours();

  let surge = 1.0;

  // 🌅 Rush hour (7–9 AM, 4–7 PM)
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19)) {
    surge += 0.3;
  }

  // 🌙 Late night (bars, clubs)
  if (hour >= 22 || hour <= 2) {
    surge += 0.5;
  }

  // 🎲 Random demand spike
  if (Math.random() < 0.15) {
    surge += Math.random() * 1.5;
  }

  // 🚗 Provider differences
  if (provider === "Uber") surge += 0.1;

  return Number(surge.toFixed(2));
}