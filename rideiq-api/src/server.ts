import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compareRouter from "./routes/compare";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---------- GLOBAL MIDDLEWARE ----------

// CORS + body parsing
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------- ROUTES ----------

app.use("/compare", compareRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "RideIQ API is running" });
});

// ---------- ERROR HANDLER (LAST) ----------

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Internal server error",
    });
  }
);

// ---------- START SERVER ----------

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});