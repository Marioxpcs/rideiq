// rideiq-mobile/app/(tabs)/index.tsx
import { ScrollView, Text, Button, View, StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const colorScheme = useColorScheme();
  const textColor = Colors[colorScheme ?? 'light'].text;

  const scrollRef = useRef<ScrollView>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await axios.post('http://10.0.0.77:3001/compare', {
        pickup: [43.4643, -80.5204],
        destination: [43.6532, -79.3832],
      });
      setData(res.data);            // <-- triggers re‑render
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      console.error('Request failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // optional: scroll to bottom when data arrives
  useEffect(() => {
    if (data && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [data]);

 return (
  <SafeAreaView style={styles.safe}>
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: textColor }]}>
        RideIQ Test
      </Text>

      <Button title="Compare Rides" onPress={fetchData} disabled={loading} />

      {loading && (
        <Text style={[styles.status, { color: textColor }]}>
          Loading…
        </Text>
      )}

      {errorMsg && (
        <Text style={[styles.status, { color: 'red' }]}>
          {errorMsg}
        </Text>
      )}

      {data && (
  <View style={styles.resultsContainer}>
    <Text style={[styles.bold, { color: textColor }]}>
      Available Rides
    </Text>

    {data.options?.map((ride: any, index: number) => (
      <View key={index} style={styles.card}>
        <Text style={styles.provider}>
          {ride.provider}
        </Text>

        <Text style={styles.price}>
          ${ride.price}
        </Text>

        <Text>Pickup ETA: {ride.eta_minutes} min</Text>

        <Text>
          Trend:{" "}
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
  container: { flex: 1 },              // fill the screen
  contentContainer: { padding: 20, paddingTop: 10,},
  title: { fontSize: 20, marginBottom: 20 },
  status: { marginTop: 20 },
  result: { marginTop: 20 },
  bold: { fontWeight: 'bold' },

  resultsContainer: {
  marginTop: 30,
},

card: {
  backgroundColor: "#1f1f1f",
  padding: 16,
  borderRadius: 12,
  marginTop: 12,
},

provider: {
  fontSize: 18,
  fontWeight: "bold",
  color: "white",
},

price: {
  fontSize: 22,
  fontWeight: "bold",
  marginVertical: 6,
  color: "#4ade80",
},
});