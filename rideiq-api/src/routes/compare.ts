import { Router, Request, Response } from "express";
import { getRideEstimates } from "../services/rideService";

const router = Router();

// POST /compare
// Body: { pickup: [lat, lng], destination: [lat, lng] }
router.post("/", async (req: Request, res: Response) => {
  const { pickup, destination } = req.body;

  if (!pickup || !destination) {
    return res.status(400).json({ error: "pickup and destination are required" });
  }

  try {
    const estimates = await getRideEstimates(pickup, destination);
    res.json(estimates);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ride estimates" });
  }
});

export default router;