import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={RideIQTheme.colors.primary} />
      <Text style={styles.title}>Comparing providers...</Text>
      <Text style={styles.subtitle}>Crunching surge, trend, and volatility signals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: RideIQTheme.spacing.section,
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.lg,
    padding: RideIQTheme.spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
  },
  title: {
    color: RideIQTheme.colors.textPrimary,
    marginTop: RideIQTheme.spacing.md,
    fontWeight: "700",
    fontSize: RideIQTheme.typography.body,
  },
  subtitle: {
    color: RideIQTheme.colors.textSecondary,
    marginTop: RideIQTheme.spacing.sm,
    textAlign: "center",
  },
});

