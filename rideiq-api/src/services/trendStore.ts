// In-memory storage of recent estimates
type ProviderSnapshot = {
  price: number;
  eta: number;
  timestamp: number;
};

const history: Record<string, ProviderSnapshot[]> = {};

export function saveSnapshot(provider: string, price: number, eta: number) {
  if (!history[provider]) {
    history[provider] = [];
  }

  history[provider].push({
    price,
    eta,
    timestamp: Date.now(),
  });

  // Keep only last 5 snapshots (V1)
  if (history[provider].length > 5) {
    history[provider].shift();
  }
}

export function getHistory(provider: string) {
  return history[provider] || [];
}