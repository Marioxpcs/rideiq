import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
  onReset: () => void;
};

export function ErrorState({ message, onRetry, onReset }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Couldn&apos;t compare rides</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.primary]} onPress={onRetry}>
          <Text style={styles.primaryText}>Retry</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.ghost]} onPress={onReset}>
          <Text style={styles.ghostText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: RideIQTheme.spacing.section,
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.lg,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.danger,
    padding: RideIQTheme.spacing.xl,
  },
  title: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: RideIQTheme.typography.section,
    fontWeight: "700",
    marginBottom: RideIQTheme.spacing.sm,
  },
  message: {
    color: RideIQTheme.colors.textSecondary,
    marginBottom: RideIQTheme.spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: RideIQTheme.spacing.sm,
  },
  button: {
    minHeight: 44,
    borderRadius: RideIQTheme.radius.md,
    paddingHorizontal: RideIQTheme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  primary: {
    backgroundColor: RideIQTheme.colors.primary,
  },
  ghost: {
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    backgroundColor: RideIQTheme.colors.surfaceElevated,
  },
  primaryText: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "700",
  },
  ghostText: {
    color: RideIQTheme.colors.textSecondary,
    fontWeight: "700",
  },
});

