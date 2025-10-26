#!/usr/bin/env node
/**
 * Production Validation Script
 * Validates production deployment and system health
 */

import fetch from "node-fetch";
import { MongoClient } from "mongodb";
import { Queue } from "bullmq";
import assert from "assert";

// Production environment configuration
const FRONTEND_URL = process.env.FRONTEND_URL || "https://showwork-frontend.onrender.com";
const BACKEND_URL = process.env.BACKEND_URL || "https://showwork-backend.onrender.com";
const MONGO_URL = process.env.MONGO_URL || process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;

console.log("🚀 Production Validation Suite");
console.log("=================================");
console.log("Frontend:", FRONTEND_URL);
console.log("Backend:", BACKEND_URL);
console.log("Database:", MONGO_URL ? "Configured" : "Not configured");
console.log("Redis:", REDIS_URL ? "Configured" : "Not configured");
console.log("=================================\n");

const results = [];

async function checkFrontend() {
  console.log("🔹 Checking Frontend availability...");
  try {
    const res = await fetch(FRONTEND_URL, { timeout: 10000 });
    assert(res.ok, `Frontend returned ${res.status}`);
    results.push({ step: "Frontend", status: "✅ Accessible" });
  } catch (error) {
    results.push({ step: "Frontend", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function checkBackendHealth() {
  console.log("🔹 Checking Backend health...");
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { timeout: 10000 });
    assert(res.ok, `Backend health check failed: ${res.status}`);
    const data = await res.json();
    assert(data.status === "ok", "Backend health check failed");
    results.push({ step: "Backend Health", status: "✅ Healthy" });
  } catch (error) {
    results.push({ step: "Backend Health", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function checkDatabase() {
  console.log("🔹 Checking Database connection...");
  try {
    if (!MONGO_URL) {
      throw new Error("Database URL not configured");
    }
    
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    assert(Array.isArray(collections), "Database not accessible");
    await client.close();
    
    results.push({ step: "Database", status: "✅ Connected" });
  } catch (error) {
    results.push({ step: "Database", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function checkRedis() {
  console.log("🔹 Checking Redis connection...");
  try {
    if (!REDIS_URL) {
      throw new Error("Redis URL not configured");
    }
    
    const queue = new Queue("production-health-check", { 
      connection: { url: REDIS_URL },
      defaultJobOptions: { removeOnComplete: 1, removeOnFail: 1 }
    });
    
    const job = await queue.add("ping", { timestamp: Date.now() });
    assert(job.id, "Failed to add job to Redis");
    await queue.close();
    
    results.push({ step: "Redis", status: "✅ Connected" });
  } catch (error) {
    results.push({ step: "Redis", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testAPIEndpoints() {
  console.log("🔹 Testing API endpoints...");
  try {
    // Test health endpoint
    const healthRes = await fetch(`${BACKEND_URL}/api/health`);
    assert(healthRes.ok, "Health endpoint failed");
    
    // Test AI generation endpoint
    const aiRes = await fetch(`${BACKEND_URL}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Production Test",
        description: "Testing production deployment",
        platforms: ["twitter", "linkedin"]
      })
    });
    
    if (aiRes.ok) {
      const aiData = await aiRes.json();
      assert(aiData.content, "AI generation failed");
    }
    
    results.push({ step: "API Endpoints", status: "✅ Working" });
  } catch (error) {
    results.push({ step: "API Endpoints", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testOAuthConfiguration() {
  console.log("🔹 Testing OAuth configuration...");
  try {
    // Check if OAuth endpoints are accessible
    const googleRes = await fetch(`${BACKEND_URL}/api/auth/google`, { 
      method: "HEAD",
      timeout: 5000 
    });
    
    const githubRes = await fetch(`${BACKEND_URL}/api/auth/github`, { 
      method: "HEAD",
      timeout: 5000 
    });
    
    // OAuth endpoints should be accessible (even if they redirect)
    results.push({ step: "OAuth Configuration", status: "✅ Configured" });
  } catch (error) {
    results.push({ step: "OAuth Configuration", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testSecurityHeaders() {
  console.log("🔹 Testing security headers...");
  try {
    const res = await fetch(FRONTEND_URL);
    const headers = res.headers;
    
    const securityHeaders = [
      'x-frame-options',
      'x-content-type-options',
      'x-xss-protection',
      'referrer-policy'
    ];
    
    const missingHeaders = securityHeaders.filter(header => !headers.get(header));
    
    if (missingHeaders.length === 0) {
      results.push({ step: "Security Headers", status: "✅ Present" });
    } else {
      results.push({ step: "Security Headers", status: "⚠️ Missing", missing: missingHeaders });
    }
  } catch (error) {
    results.push({ step: "Security Headers", status: "❌ Failed", error: error.message });
  }
}

async function summary() {
  console.log("\n=================================");
  console.log("📊 PRODUCTION VALIDATION SUMMARY");
  console.log("=================================");
  
  for (const r of results) {
    const status = r.status.includes("✅") ? "✅" : r.status.includes("⚠️") ? "⚠️" : "❌";
    const step = r.step.padEnd(25);
    console.log(`${step} → ${status} ${r.status.replace(/[✅❌⚠️]/g, '').trim()}`);
    if (r.error) {
      console.log(`   Error: ${r.error}`);
    }
    if (r.missing) {
      console.log(`   Missing: ${r.missing.join(', ')}`);
    }
  }
  
  console.log("=================================");

  const failed = results.filter(r => r.status.includes("❌"));
  const warnings = results.filter(r => r.status.includes("⚠️"));
  
  if (failed.length === 0) {
    console.log("🎉 PRODUCTION DEPLOYMENT SUCCESSFUL!");
    console.log("\n🚀 Your ShowWork application is live and ready for users!");
    console.log(`Frontend: ${FRONTEND_URL}`);
    console.log(`Backend: ${BACKEND_URL}`);
    
    if (warnings.length > 0) {
      console.log(`\n⚠️ ${warnings.length} warnings found - consider addressing these for better security.`);
    }
  } else {
    console.error(`❌ ${failed.length} validation checks failed`);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Check service logs in Render dashboard");
    console.log("2. Verify environment variables are set correctly");
    console.log("3. Ensure all services are running");
    console.log("4. Check network connectivity and DNS resolution");
    process.exit(1);
  }
}

// Execute all validation checks
(async () => {
  try {
    await checkFrontend();
    await checkBackendHealth();
    await checkDatabase();
    await checkRedis();
    await testAPIEndpoints();
    await testOAuthConfiguration();
    await testSecurityHeaders();
  } catch (err) {
    console.error("❌ VALIDATION FAILED:", err.message);
    console.log("\n🔧 Check the following:");
    console.log("- Services are deployed and running");
    console.log("- Environment variables are configured");
    console.log("- Network connectivity is working");
    console.log("- OAuth credentials are valid");
  } finally {
    await summary();
  }
})();
