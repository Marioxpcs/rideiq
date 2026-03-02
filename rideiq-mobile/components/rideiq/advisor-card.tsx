import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";
import type { VolatilityLevel } from "@/types/compare";

type AdvisorCardProps = {
  decision: string;
  reasoning: string;
  volatilityLevel?: VolatilityLevel;
  volatilityScore?: number | null;
  isHighVolatility: boolean;
  expectedSavings?: number;
  confidence?: number | null;
  onPressExplain: () => void;
};

function formatVolatilityLevel(level?: VolatilityLevel) {
  if (!level) return "Unknown";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

export function AdvisorCard({
  decision,
  reasoning,
  volatilityLevel,
  volatilityScore,
  isHighVolatility,
  expectedSavings,
  confidence,
  onPressExplain,
}: AdvisorCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.decision}>{decision}</Text>
        <Pressable onPress={onPressExplain} style={styles.explainButton}>
          <Text style={styles.explainButtonText}>How this works</Text>
        </Pressable>
      </View>

      <Text style={styles.reasoning}>{reasoning}</Text>

      {volatilityLevel && (
        <Text style={styles.volatilityText}>
          Volatility: {formatVolatilityLevel(volatilityLevel)}
          {typeof volatilityScore === "number"
            ? ` (${Math.round(volatilityScore * 100)}%)`
            : ""}
        </Text>
      )}

      {isHighVolatility && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>Price unstable - high fluctuation detected</Text>
        </View>
      )}

      {typeof expectedSavings === "number" && (
        <Text style={styles.savings}>Potential savings: ${expectedSavings.toFixed(2)}</Text>
      )}

      {typeof confidence === "number" && (
        <>
          <View style={styles.confidenceContainer}>
            <View style={[styles.confidenceBar, { width: `${confidence}%` }]} />
          </View>

          <Text style={styles.confidenceText}>Confidence: {confidence}%</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.xl,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    padding: RideIQTheme.spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: RideIQTheme.spacing.sm,
    marginBottom: RideIQTheme.spacing.sm,
  },
  decision: {
    color: RideIQTheme.colors.confidenceFill,
    fontSize: RideIQTheme.typography.recommendation,
    fontWeight: "800",
    flexShrink: 1,
  },
  explainButton: {
    backgroundColor: RideIQTheme.colors.surfaceElevated,
    borderRadius: RideIQTheme.radius.sm,
    paddingVertical: 6,
    paddingHorizontal: RideIQTheme.spacing.sm,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
  },
  explainButtonText: {
    color: RideIQTheme.colors.textSecondary,
    fontSize: 12,
  },
  reasoning: {
    color: RideIQTheme.colors.textPrimary,
    marginBottom: RideIQTheme.spacing.sm,
    lineHeight: 24,
    fontSize: RideIQTheme.typography.body,
  },
  volatilityText: {
    color: RideIQTheme.colors.warning,
    marginBottom: RideIQTheme.spacing.sm,
    fontWeight: "600",
  },
  alertBox: {
    backgroundColor: RideIQTheme.colors.warningMuted,
    borderColor: RideIQTheme.colors.warning,
    borderWidth: 1,
    borderRadius: RideIQTheme.radius.md,
    padding: RideIQTheme.spacing.md,
    marginBottom: RideIQTheme.spacing.md,
  },
  alertText: {
    color: "#F8E9C2",
    fontWeight: "700",
  },
  savings: {
    color: RideIQTheme.colors.success,
    marginBottom: RideIQTheme.spacing.md,
    fontWeight: "600",
  },
  confidenceContainer: {
    height: 10,
    backgroundColor: RideIQTheme.colors.confidenceTrack,
    borderRadius: RideIQTheme.radius.sm,
    overflow: "hidden",
    marginBottom: RideIQTheme.spacing.sm,
  },
  confidenceBar: {
    height: "100%",
    backgroundColor: RideIQTheme.colors.confidenceFill,
  },
  confidenceText: {
    color: RideIQTheme.colors.textSecondary,
    fontWeight: "600",
  },
});

