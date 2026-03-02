import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";

export function EmptyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ready to compare</Text>
      <Text style={styles.subtitle}>
        Choose pickup and destination to get live ride recommendations.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: RideIQTheme.spacing.section,
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.lg,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    padding: RideIQTheme.spacing.xl,
    alignItems: "center",
  },
  title: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "700",
    fontSize: RideIQTheme.typography.section,
    marginBottom: RideIQTheme.spacing.sm,
  },
  subtitle: {
    color: RideIQTheme.colors.textSecondary,
    textAlign: "center",
  },
});

