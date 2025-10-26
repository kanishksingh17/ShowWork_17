#!/usr/bin/env node
import fetch from "node-fetch";
const BACKEND_URL = process.env.BACKEND_URL || "https://showwork-backend.onrender.com";
console.log("🌍 Testing Production Deployment...");

const res = await fetch(`${BACKEND_URL}/api/health`);
const data = await res.json();

if (res.ok && data.status === "ok") {
  console.log("✅ Production API reachable and healthy!");
  process.exit(0);
} else {
  console.error("❌ Health check failed:", data);
  process.exit(1);
}
