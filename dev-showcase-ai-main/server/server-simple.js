import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "*",
  credentials: true
}));

app.use(session({ secret: process.env.SESSION_SECRET || "showwork", resave: false, saveUninitialized: false }));

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI");
  process.exit(1);
}
await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 });
console.log("✅ Connected to MongoDB");

import analyticsRouter from "../src/app/api/analytics/router.js";
import calendarRouter from "../src/app/api/calendar/router.js";
import socialRouter from "../src/app/api/social-media/router.js";
import portfolioRouter from "../src/app/api/portfolio/router.js";

app.use("/api/analytics", analyticsRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/social-media", socialRouter);
app.use("/api/portfolio", portfolioRouter);

app.get("/", (_, res) => res.json({ success: true, message: "Backend OK", ts: new Date().toISOString() }));
app.get("/api/health", (_, res) => res.json({ status: "ok", mongo: mongoose.connection.readyState === 1 }));

app.use((req, res) => res.status(404).json({ error: "Not Found", path: req.path }));
app.use((err, req, res, _next) => {
  console.error("Error", err);
  res.status(500).json({ error: "Server Error", message: err?.message });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
