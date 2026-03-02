import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";

type ExplainerModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ExplainerModal({ visible, onClose }: ExplainerModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>How Recommendation Works</Text>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>Signals Used</Text>
            <Text style={styles.body}>1. Price and pickup ETA across providers.</Text>
            <Text style={styles.body}>2. Surge multiplier and trend direction.</Text>
            <Text style={styles.body}>3. Recent price volatility (last 5 snapshots).</Text>

            <Text style={styles.sectionTitle}>Recommendation Logic</Text>
            <Text style={styles.body}>
              BOOK NOW is chosen when pricing is stable enough and immediate value is strong.
            </Text>
            <Text style={styles.body}>
              WAIT is chosen when surge and volatility imply better prices may appear shortly.
            </Text>

            <Text style={styles.sectionTitle}>Confidence</Text>
            <Text style={styles.body}>
              Confidence reflects how strongly the current signals support one decision over the
              other.
            </Text>
          </ScrollView>

          <Pressable onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: RideIQTheme.colors.surface,
    borderTopLeftRadius: RideIQTheme.radius.xl,
    borderTopRightRadius: RideIQTheme.radius.xl,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    maxHeight: "80%",
    padding: RideIQTheme.spacing.xl,
  },
  title: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: RideIQTheme.typography.section,
    fontWeight: "800",
    marginBottom: RideIQTheme.spacing.md,
  },
  content: {
    paddingBottom: RideIQTheme.spacing.lg,
  },
  sectionTitle: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "700",
    marginTop: RideIQTheme.spacing.md,
    marginBottom: RideIQTheme.spacing.sm,
  },
  body: {
    color: RideIQTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: RideIQTheme.spacing.sm,
  },
  closeButton: {
    minHeight: 44,
    borderRadius: RideIQTheme.radius.md,
    backgroundColor: RideIQTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "700",
  },
});

