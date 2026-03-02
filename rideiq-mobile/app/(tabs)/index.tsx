// rideiq-mobile/app/(tabs)/index.tsx

import {
  ScrollView,
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = "http://10.0.0.77:3001";

export default function HomeScreen() {
  // =============================
  // LOCATION STATE
  // =============================

  // Pickup
  const [pickupQuery, setPickupQuery] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([]);
  const [pickupCoords, setPickupCoords] =
    useState<[number, number] | null>(null);

  // Destination
  const [destinationQuery, setDestinationQuery] = useState("");
  const [destinationSuggestions, setDestinationSuggestions] =
    useState<any[]>([]);
  const [destinationCoords, setDestinationCoords] =
    useState<[number, number] | null>(null);

  // =============================
  // APP STATE
  // =============================

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? "light"].text;

  const scrollRef = useRef<ScrollView>(null);

  // =============================
  // SELECTION HANDLERS
  // =============================

  const handlePickupSelect = (item: any) => {
    setPickupQuery(item.formatted);
    setPickupCoords([item.lat, item.lng]);
    setPickupSuggestions([]);
  };

  const handleDestinationSelect = (item: any) => {
    setDestinationQuery(item.formatted);
    setDestinationCoords([item.lat, item.lng]);
    setDestinationSuggestions([]);
  };

  // =============================
  // FETCH COMPARE
  // =============================

  const fetchData = async () => {
    if (!pickupCoords || !destinationCoords) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const res = await axios.post(`${API_BASE}/compare`, {
        pickup: pickupCoords,
        destination: destinationCoords,
      });

      setData(res.data);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          err?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // PICKUP SUGGESTIONS
  // =============================

  useEffect(() => {
    if (!pickupQuery) {
      setPickupSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE}/suggest`, {
          params: { q: pickupQuery },
        });
        setPickupSuggestions(res.data);
      } catch (err) {
        console.error("Pickup suggestion error:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [pickupQuery]);

  // =============================
  // DESTINATION SUGGESTIONS
  // =============================

  useEffect(() => {
    if (!destinationQuery) {
      setDestinationSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE}/suggest`, {
          params: { q: destinationQuery },
        });
        setDestinationSuggestions(res.data);
      } catch (err) {
        console.error("Destination suggestion error:", err);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [destinationQuery]);

  // =============================
  // AUTO SCROLL RESULTS
  // =============================

  useEffect(() => {
    if (data && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [data]);

  // =============================
  // UI
  // =============================

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* HEADER */}
        <Text style={[styles.title, { color: textColor }]}>
          RideIQ
        </Text>

        {/* PICKUP INPUT */}
        <TextInput
          value={pickupQuery}
          onChangeText={(text) => {
            setPickupQuery(text);
            setPickupCoords(null);
          }}
          placeholder="Enter pickup location"
          placeholderTextColor="#888"
          style={styles.input}
        />

        {pickupSuggestions.map((item, index) => (
          <Text
            key={index}
            style={styles.suggestionItem}
            onPress={() => handlePickupSelect(item)}
          >
            {item.formatted}
          </Text>
        ))}

        {/* DESTINATION INPUT */}
        <TextInput
          value={destinationQuery}
          onChangeText={(text) => {
            setDestinationQuery(text);
            setDestinationCoords(null);
          }}
          placeholder="Enter destination"
          placeholderTextColor="#888"
          style={styles.input}
        />

        {destinationSuggestions.map((item, index) => (
          <Text
            key={index}
            style={styles.suggestionItem}
            onPress={() => handleDestinationSelect(item)}
          >
            {item.formatted}
          </Text>
        ))}

        {/* COMPARE BUTTON */}
        <Button
          title={loading ? "Comparing..." : "Compare Rides"}
          onPress={fetchData}
          disabled={loading || !pickupCoords || !destinationCoords}
        />

        {/* STATUS */}
        {loading && (
          <Text style={[styles.status, { color: textColor }]}>
            Loading…
          </Text>
        )}

        {errorMsg && (
          <Text style={[styles.status, { color: "red" }]}>
            {errorMsg}
          </Text>
        )}

        {/* RESULTS */}
        {data && (
          <View style={styles.resultsContainer}>
            {data.best_option && (
              <View style={styles.bestCard}>
                <Text style={styles.bestLabel}>
                  ⭐ BEST OPTION
                </Text>

                <Text style={styles.bestProvider}>
                  {data.best_option.provider}
                </Text>

                <Text style={styles.bestDetails}>
                  ${data.best_option.price} CAD • Pickup{" "}
                  {data.best_option.eta_minutes} min
                </Text>

                <Text>
                  Surge x{data.best_option.surge_multiplier}
                </Text>

                <Text>
                  {data.best_option.surge_multiplier > 1.3
                    ? "🔥 High surge"
                    : data.best_option.surge_multiplier > 1.1
                    ? "⚠️ Moderate surge"
                    : "🟢 Normal pricing"}
                </Text>

                <Text>
                  {data.best_option.trend === "rising"
                    ? "📈 Rising"
                    : data.best_option.trend === "falling"
                    ? "📉 Falling"
                    : "🟢 Stable"}
                </Text>
              </View>
            )}

            {data.options?.map((ride: any, i: number) => (
              <View key={i} style={styles.card}>
                <Text style={styles.provider}>
                  {ride.provider}
                </Text>

                <Text style={styles.price}>
                  ${ride.price} CAD
                </Text>

                <Text>
                  Pickup: {ride.eta_minutes} min
                </Text>

                <Text>
                  Surge x{ride.surge_multiplier}
                </Text>

                <Text>
                  {ride.surge_multiplier > 1.3
                    ? "🔥 High surge"
                    : ride.surge_multiplier > 1.1
                    ? "⚠️ Moderate surge"
                    : "🟢 Normal pricing"}
                </Text>

                <Text>
                  {ride.trend === "rising"
                    ? "📈 Rising"
                    : ride.trend === "falling"
                    ? "📉 Falling"
                    : "🟢 Stable"}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  contentContainer: { padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#1f1f1f",
    padding: 12,
    borderRadius: 10,
    color: "white",
    marginBottom: 10,
  },

  status: { marginTop: 10 },

  resultsContainer: { marginTop: 30 },

  bestCard: {
    backgroundColor: "#4ade80",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
  },

  bestLabel: {
    fontWeight: "bold",
    fontSize: 12,
  },

  bestProvider: {
    fontSize: 20,
    fontWeight: "bold",
  },

  bestDetails: { marginTop: 4 },

  card: {
    backgroundColor: "#1f1f1f",
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
  },

  provider: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  suggestionItem: {
    padding: 10,
    backgroundColor: "#2a2a2a",
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 6,
    color: "#4ade80",
  },
});