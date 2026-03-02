import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";
import { MiniSparkline } from "@/components/rideiq/mini-sparkline";
import type { RideOption } from "@/types/compare";

type ProviderCardProps = {
  option: RideOption;
  isBest?: boolean;
};

function getTrendColor(trend: RideOption["trend"]) {
  if (trend === "falling") return RideIQTheme.colors.success;
  if (trend === "rising") return RideIQTheme.colors.danger;
  return RideIQTheme.colors.textTertiary;
}

function getVolatilityColor(level: RideOption["volatility_level"]) {
  if (level === "low") return RideIQTheme.colors.success;
  if (level === "moderate") return RideIQTheme.colors.warning;
  if (level === "high") return RideIQTheme.colors.danger;
  return RideIQTheme.colors.textTertiary;
}

export function ProviderCard({ option, isBest = false }: ProviderCardProps) {
  return (
    <View style={[styles.card, isBest && styles.bestCard]}>
      {isBest && <Text style={styles.bestBadge}>BEST OPTION</Text>}
      <Text style={styles.provider}>{option.provider}</Text>

      <Text style={styles.price}>
        ${option.price.toFixed(2)} {option.currency}
      </Text>
      <Text style={styles.meta}>Pickup ETA: {option.eta_minutes} min</Text>

      <View style={styles.badgeRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Surge</Text>
          <Text style={styles.badgeValue}>x{option.surge_multiplier}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Trend</Text>
          <Text style={[styles.badgeValue, { color: getTrendColor(option.trend) }]}>
            {option.trend}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeLabel}>Volatility</Text>
          <Text
            style={[
              styles.badgeValue,
              { color: getVolatilityColor(option.volatility_level) },
            ]}
          >
            {option.volatility_level}
          </Text>
        </View>
      </View>

      <Text style={styles.historyTitle}>5-Point Price History</Text>
      <MiniSparkline values={option.recent_prices} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.lg,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    padding: RideIQTheme.spacing.lg,
    marginBottom: RideIQTheme.spacing.md,
  },
  bestCard: {
    borderColor: RideIQTheme.colors.primary,
    backgroundColor: RideIQTheme.colors.surfaceElevated,
  },
  bestBadge: {
    alignSelf: "flex-start",
    marginBottom: RideIQTheme.spacing.sm,
    paddingHorizontal: RideIQTheme.spacing.sm,
    paddingVertical: RideIQTheme.spacing.xs,
    borderRadius: RideIQTheme.radius.sm,
    backgroundColor: RideIQTheme.colors.primary,
    color: RideIQTheme.colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  provider: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: RideIQTheme.typography.provider,
    fontWeight: "700",
    marginBottom: RideIQTheme.spacing.xs,
  },
  price: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: RideIQTheme.spacing.xs,
  },
  meta: {
    color: RideIQTheme.colors.textSecondary,
    marginBottom: RideIQTheme.spacing.md,
  },
  badgeRow: {
    flexDirection: "row",
    gap: RideIQTheme.spacing.sm,
    marginBottom: RideIQTheme.spacing.md,
  },
  badge: {
    flex: 1,
    backgroundColor: RideIQTheme.colors.surfaceElevated,
    borderRadius: RideIQTheme.radius.md,
    padding: RideIQTheme.spacing.sm,
  },
  badgeLabel: {
    color: RideIQTheme.colors.textTertiary,
    fontSize: 11,
    marginBottom: 2,
  },
  badgeValue: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  historyTitle: {
    color: RideIQTheme.colors.textTertiary,
    marginBottom: RideIQTheme.spacing.sm,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

