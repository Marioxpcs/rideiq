import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";

type MiniSparklineProps = {
  values: number[];
};

export function MiniSparkline({ values }: MiniSparklineProps) {
  const points = values.filter((v) => Number.isFinite(v));

  if (points.length < 2) {
    return <Text style={styles.hint}>Collecting history...</Text>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  return (
    <View style={styles.sparklineWrap}>
      <View style={styles.sparklineRow}>
        {points.map((value, index) => {
          const height = 6 + ((value - min) / range) * 22;
          return (
            <View key={`${index}-${value}`} style={[styles.sparklineBar, { height }]} />
          );
        })}
      </View>
      <View style={styles.sparklineAxis}>
        <Text style={styles.axisText}>${min.toFixed(0)}</Text>
        <Text style={styles.axisText}>${max.toFixed(0)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sparklineWrap: {
    marginBottom: RideIQTheme.spacing.sm,
  },
  sparklineRow: {
    height: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  sparklineBar: {
    flex: 1,
    minHeight: 6,
    borderRadius: 2,
    backgroundColor: RideIQTheme.colors.primary,
  },
  hint: {
    color: RideIQTheme.colors.textTertiary,
    fontSize: RideIQTheme.typography.caption,
  },
  sparklineAxis: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: RideIQTheme.spacing.xs,
  },
  axisText: {
    color: RideIQTheme.colors.textTertiary,
    fontSize: 11,
  },
});

