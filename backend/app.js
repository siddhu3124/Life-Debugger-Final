import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";

const app = express();

const devOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175"
];

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  ...devOrigins
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    service: "life-debugger-backend",
    company: "Life Debugger",
    contact: {
      phone: "+91 6300500266",
      email: "siddhupappuu@gmail.com",
      address: "Nanakramguda, Hyderabad"
    },
    license: "© 2026 Life Debugger. All rights reserved."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Life Debugger backend running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

