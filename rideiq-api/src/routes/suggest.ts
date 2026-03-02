import { Router } from "express";
import axios from "axios";

const router = Router();

const OPENCAGE_URL = "https://api.opencagedata.com/geocode/v1/json";

router.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.json([]);
    }

    const response = await axios.get(OPENCAGE_URL, {
      params: {
        q,
        key: process.env.OPENCAGE_API_KEY,
        limit: 5,
        countrycode: "ca", // bias to Canada
      },
    });

    const suggestions = response.data.results.map((r: any) => ({
      formatted: r.formatted,
      lat: r.geometry.lat,
      lng: r.geometry.lng,
    }));

    res.json(suggestions);
  } catch (error) {
    console.error("Suggestion error:", error);
    res.status(500).json({ error: "Suggestion fetch failed" });
  }
});

export default router;