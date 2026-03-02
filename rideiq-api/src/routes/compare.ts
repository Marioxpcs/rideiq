import { geocodeAddress } from "../services/geocode";
import { Router, Request, Response } from "express";
import { getRideEstimates } from "../services/rideService";


const router = Router();

// POST /compare
// Body: { pickup: [lat, lng], destination: [lat, lng] }
router.post("/", async (req: Request, res: Response) => {
 const { pickup, destination } = req.body;

// If strings → geocode them
const pickupCoords =
  typeof pickup === "string"
    ? await geocodeAddress(pickup)
    : pickup;

const destCoords =
  typeof destination === "string"
    ? await geocodeAddress(destination)
    : destination;

// Use coords in your existing logic
const result = await getRideEstimates(
  pickupCoords,
  destCoords
);

res.json(result);
});

export default router;