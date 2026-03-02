import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE } from "@/constants/api";
import { RideIQTheme } from "@/constants/rideiq-theme";
import { useSuggestions } from "@/hooks/useSuggestions";
import { LocationInput } from "@/components/rideiq/location-input";
import { ProviderCard } from "@/components/rideiq/provider-card";
import { AdvisorCard } from "@/components/rideiq/advisor-card";
import { LoadingState } from "@/components/rideiq/loading-state";
import { ErrorState } from "@/components/rideiq/error-state";
import { EmptyState } from "@/components/rideiq/empty-state";
import { ExplainerModal } from "@/components/rideiq/explainer-modal";
import type {
  AdvisorResponse,
  CompareResponse,
  SuggestionItem,
} from "@/types/compare";

type AdvisorForUI =
  Pick<
    AdvisorResponse,
    "recommendation" | "reasoning" | "volatility_level" | "volatility_score"
  > &
  Partial<Pick<AdvisorResponse, "expected_savings" | "confidence">>;

type AppState = "idle" | "loading" | "results" | "error";

export default function HomeScreen() {
  const [pickupQuery, setPickupQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null
  );
  const [destinationCoords, setDestinationCoords] = useState<
    [number, number] | null
  >(null);

  const [data, setData] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [showExplainer, setShowExplainer] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const pickupSuggestions = useSuggestions(pickupCoords ? "" : pickupQuery);
  const destinationSuggestions = useSuggestions(
    destinationCoords ? "" : destinationQuery
  );

  const clearResults = () => {
    setData(null);
    if (appState !== "loading") {
      setAppState("idle");
    }
  };

  const handleSelect = (
    item: SuggestionItem,
    setterQuery: React.Dispatch<React.SetStateAction<string>>,
    setterCoords: React.Dispatch<React.SetStateAction<[number, number] | null>>
  ) => {
    const lng = item.lng ?? item.lon;
    if (lng === undefined) {
      setError("Selected location is missing coordinates. Please choose another suggestion.");
      return;
    }

    setError(null);
    setterQuery(item.formatted);
    setterCoords([item.lat, lng]);

    if (appState === "error") {
      setAppState("idle");
    }
  };

  const handleCompare = async () => {
    if (!pickupCoords || !destinationCoords) {
      setError("Please select valid locations from suggestions.");
      setAppState("idle");
      return;
    }

    try {
      setError(null);
      setAppState("loading");

      const response = await axios.post<CompareResponse>(`${API_BASE}/compare`, {
        pickup: pickupCoords,
        destination: destinationCoords,
      });

      const options = Array.isArray(response.data?.options)
        ? response.data.options
        : [];

      const missingVolatilityFields = options.some(
        (opt) =>
          opt?.volatility_level === undefined ||
          opt?.volatility_score === undefined ||
          !Array.isArray(opt?.recent_prices)
      );

      if (missingVolatilityFields) {
        setError(
          "API response is missing expected analytics fields. Restart rideiq-api with npm run dev."
        );
        setData(null);
        setAppState("error");
        return;
      }

      setData(response.data);
      setAppState("results");

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    } catch (err) {
      console.error(err);
      setError("Failed to fetch estimates. Check API/server connection and try again.");
      setData(null);
      setAppState("error");
    }
  };

  const handleReset = () => {
    setError(null);
    setData(null);
    setAppState("idle");
  };

  const advisorRaw = data?.advisor;
  const advisor =
    advisorRaw && typeof advisorRaw === "object"
      ? (advisorRaw as AdvisorForUI)
      : null;
  const bestOption = data?.best_option ?? null;

  const fallbackAdvisor: AdvisorForUI | null =
    bestOption !== null
      ? {
          recommendation: "BOOK_NOW" as const,
          reasoning: `Best current option is ${bestOption.provider} at $${bestOption.price} ${bestOption.currency}.`,
          volatility_level: bestOption.volatility_level,
          volatility_score: bestOption.volatility_score,
        }
      : null;

  const advisorToShow = advisor ?? fallbackAdvisor;

  const recommendation = advisorToShow?.recommendation ?? null;
  const advisorDecision =
    recommendation === "BOOK_NOW"
      ? `BOOK NOW${bestOption?.provider ? ` - ${bestOption.provider}` : ""}`
      : recommendation === "WAIT"
      ? "WAIT"
      : null;
  const advisorReasoning = advisorToShow?.reasoning ?? null;
  const advisorSavings =
    typeof advisorToShow?.expected_savings === "number"
      ? advisorToShow.expected_savings
      : undefined;
  const advisorConfidence =
    typeof advisorToShow?.confidence === "number"
      ? Math.max(0, Math.min(100, advisorToShow.confidence))
      : null;

  const volatilityLevel =
    bestOption?.volatility_level ?? advisorToShow?.volatility_level;
  const volatilityScore =
    typeof bestOption?.volatility_score === "number"
      ? bestOption.volatility_score
      : typeof advisorToShow?.volatility_score === "number"
      ? advisorToShow.volatility_score
      : null;

  const isHighVolatility = volatilityLevel === "high";

  const canCompare = Boolean(pickupCoords && destinationCoords);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        ref={scrollRef}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>RideIQ</Text>

        <LocationInput
          label="Pickup"
          placeholder="Pickup location"
          value={pickupQuery}
          onChangeText={(text) => {
            setPickupQuery(text);
            setPickupCoords(null);
            setError(null);
            clearResults();
          }}
          suggestions={pickupSuggestions}
          showSuggestions={!pickupCoords}
          onSelectSuggestion={(item) =>
            handleSelect(item, setPickupQuery, setPickupCoords)
          }
        />

        <LocationInput
          label="Destination"
          placeholder="Destination"
          value={destinationQuery}
          onChangeText={(text) => {
            setDestinationQuery(text);
            setDestinationCoords(null);
            setError(null);
            clearResults();
          }}
          suggestions={destinationSuggestions}
          showSuggestions={!destinationCoords}
          onSelectSuggestion={(item) =>
            handleSelect(item, setDestinationQuery, setDestinationCoords)
          }
        />

        <Pressable
          onPress={handleCompare}
          disabled={!canCompare || appState === "loading"}
          style={[styles.compareButton, (!canCompare || appState === "loading") && styles.compareButtonDisabled]}
        >
          <Text style={styles.compareButtonText}>
            {appState === "loading" ? "Comparing..." : "Compare Rides"}
          </Text>
        </Pressable>

        {error && appState !== "error" && <Text style={styles.errorInline}>{error}</Text>}

        {appState === "idle" && <EmptyState />}

        {appState === "loading" && <LoadingState />}

        {appState === "error" && (
          <ErrorState
            message={error ?? "Something went wrong."}
            onRetry={handleCompare}
            onReset={handleReset}
          />
        )}

        {appState === "results" && data && (
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.sectionTitle}>Options</Text>

            {data.options.map((opt, idx) => (
              <ProviderCard
                key={`${opt.provider}-${idx}`}
                option={opt}
                isBest={data.best_option?.provider === opt.provider}
              />
            ))}

            {advisorDecision && advisorReasoning && (
              <>
                <Text style={styles.sectionTitle}>Advisor</Text>
                <AdvisorCard
                  decision={advisorDecision}
                  reasoning={advisorReasoning}
                  volatilityLevel={volatilityLevel}
                  volatilityScore={volatilityScore}
                  isHighVolatility={isHighVolatility}
                  expectedSavings={advisorSavings}
                  confidence={advisorConfidence}
                  onPressExplain={() => setShowExplainer(true)}
                />
              </>
            )}
          </Animated.View>
        )}
      </ScrollView>

      <ExplainerModal visible={showExplainer} onClose={() => setShowExplainer(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: RideIQTheme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: RideIQTheme.spacing.xl,
    backgroundColor: RideIQTheme.colors.background,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: RideIQTheme.typography.title,
    fontWeight: "800",
    marginTop: RideIQTheme.spacing.md,
    marginBottom: RideIQTheme.spacing.section,
  },
  compareButton: {
    minHeight: 48,
    borderRadius: RideIQTheme.radius.md,
    backgroundColor: RideIQTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: RideIQTheme.spacing.sm,
  },
  compareButtonDisabled: {
    opacity: 0.45,
  },
  compareButtonText: {
    color: RideIQTheme.colors.textPrimary,
    fontWeight: "700",
    fontSize: RideIQTheme.typography.body,
  },
  errorInline: {
    color: RideIQTheme.colors.danger,
    marginTop: RideIQTheme.spacing.sm,
  },
  sectionTitle: {
    color: RideIQTheme.colors.textPrimary,
    fontSize: RideIQTheme.typography.section,
    fontWeight: "800",
    marginTop: RideIQTheme.spacing.section,
    marginBottom: RideIQTheme.spacing.md,
  },
});
