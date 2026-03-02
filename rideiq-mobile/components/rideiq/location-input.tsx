import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RideIQTheme } from "@/constants/rideiq-theme";
import type { SuggestionItem } from "@/types/compare";

type LocationInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  suggestions: SuggestionItem[];
  showSuggestions: boolean;
  onSelectSuggestion: (item: SuggestionItem) => void;
};

export function LocationInput({
  label,
  placeholder,
  value,
  onChangeText,
  suggestions,
  showSuggestions,
  onSelectSuggestion,
}: LocationInputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={RideIQTheme.colors.textTertiary}
        value={value}
        onChangeText={onChangeText}
      />

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={`${item.formatted}-${item.lat}-${item.lng ?? item.lon ?? index}`}
              onPress={() => onSelectSuggestion(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.suggestionItem}>{item.formatted}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: RideIQTheme.spacing.md,
  },
  label: {
    color: RideIQTheme.colors.textSecondary,
    marginBottom: RideIQTheme.spacing.sm,
    fontSize: RideIQTheme.typography.caption,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: RideIQTheme.colors.surfaceElevated,
    padding: RideIQTheme.spacing.md,
    borderRadius: RideIQTheme.radius.md,
    color: RideIQTheme.colors.textPrimary,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    minHeight: 48,
  },
  suggestionContainer: {
    marginTop: RideIQTheme.spacing.sm,
    backgroundColor: RideIQTheme.colors.surface,
    borderRadius: RideIQTheme.radius.md,
    borderWidth: 1,
    borderColor: RideIQTheme.colors.border,
    overflow: "hidden",
  },
  suggestionItem: {
    color: RideIQTheme.colors.textPrimary,
    paddingVertical: RideIQTheme.spacing.md,
    paddingHorizontal: RideIQTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: RideIQTheme.colors.border,
    minHeight: 44,
  },
});

