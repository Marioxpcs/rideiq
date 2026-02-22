import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compareRouter from "./routes/compare.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/compare", compareRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "RideIQ API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});