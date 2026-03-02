export type Trend = "rising" | "falling" | "stable" | "unknown";

export type VolatilityLevel = "low" | "moderate" | "high" | "unknown";

export type SuggestionItem = {
  formatted: string;
  lat: number;
  lng?: number;
  lon?: number;
};

export type RideOption = {
  provider: string;
  price: number;
  eta_minutes: number;
  currency: string;
  surge_multiplier: number;
  trend: Trend;
  volatility_score: number;
  volatility_level: VolatilityLevel;
  recent_prices: number[];
};

export type BestRideOption = RideOption & {
  score: number;
};

export type AdvisorResponse = {
  recommendation: "BOOK_NOW" | "WAIT";
  confidence: number;
  reasoning: string;
  expected_savings?: number;
  volatility_score: number;
  volatility_level: VolatilityLevel;
};

export type CompareResponse = {
  timestamp: string;
  pickup: [number, number];
  destination: [number, number];
  options: RideOption[];
  best_option: BestRideOption | null;
  advisor?: AdvisorResponse | string;
};

