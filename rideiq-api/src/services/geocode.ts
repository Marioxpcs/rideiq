import axios from "axios";

const API_KEY = process.env.OPENCAGE_API_KEY;

export async function geocodeAddress(address: string) {
  if (!API_KEY) {
    throw new Error("Missing OPENCAGE_API_KEY");
  }

  const url = "https://api.opencagedata.com/geocode/v1/json";

  const res = await axios.get(url, {
    params: {
      q: address,
      key: API_KEY,
      limit: 1,
    },
  });

  const result = res.data.results?.[0];

  if (!result) {
    throw new Error(`Location not found: ${address}`);
  }

  return [
    result.geometry.lat,
    result.geometry.lng,
  ] as [number, number];
}