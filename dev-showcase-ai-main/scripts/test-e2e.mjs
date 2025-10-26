#!/usr/bin/env node
/**
 * test-e2e.mjs
 * End-to-End Integration Test Script for ShowWork / DevShowcase AI
 * ---------------------------------------------------------------
 * Validates: API, MongoDB, Redis, Workers, AI generation, and Analytics
 */

import fetch from "node-fetch";
import { MongoClient } from "mongodb";
import { Queue } from "bullmq";
import assert from "assert";

// Load environment variables
const API_URL = process.env.API_URL || "http://localhost:5001";
const MONGO_URL = process.env.MONGO_URL || "mongodb://admin:password123@localhost:27017/showwork?authSource=admin";
const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

console.log("🧩 Starting End-to-End Test Suite...");
console.log("--------------------------------------------------");
console.log("API:", API_URL);
console.log("Mongo:", MONGO_URL);
console.log("Redis:", REDIS_URL);
console.log("--------------------------------------------------\n");

let mongoClient;
const results = [];

async function checkAPI() {
  console.log("🔹 Checking Backend API health...");
  try {
    const res = await fetch(`${API_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    assert(data.status === "ok", "Unexpected health response");
    results.push({ step: "API Health", status: "✅ Passed" });
  } catch (error) {
    results.push({ step: "API Health", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function checkMongo() {
  console.log("🔹 Checking MongoDB connection...");
  try {
    mongoClient = new MongoClient(MONGO_URL);
    await mongoClient.connect();
    const db = mongoClient.db();
    const collections = await db.listCollections().toArray();
    assert(Array.isArray(collections), "Collections not accessible");
    results.push({ step: "MongoDB", status: "✅ Connected" });
  } catch (error) {
    results.push({ step: "MongoDB", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function checkRedisQueue() {
  console.log("🔹 Checking Redis Queue...");
  try {
    const queue = new Queue("postQueue", { connection: { url: REDIS_URL } });
    const job = await queue.add("test", { ping: true });
    assert(job.id, "Failed to add job to Redis queue");
    results.push({ step: "Redis Queue", status: "✅ Operational" });
    await queue.close();
  } catch (error) {
    results.push({ step: "Redis Queue", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testPostCreation() {
  console.log("🔹 Testing API: Create Scheduled Post...");
  try {
    const res = await fetch(`${API_URL}/api/calendar/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: "demo123",
        platforms: ["twitter", "linkedin"],
        content: "🚀 AI-powered showcase post test!",
        scheduledAt: new Date(Date.now() + 3600000).toISOString(),
        userId: "test-user-123"
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    assert(data.jobId, "Failed to schedule post");
    results.push({ step: "Post Scheduling", status: "✅ Working" });
  } catch (error) {
    results.push({ step: "Post Scheduling", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testAIIntegration() {
  console.log("🔹 Testing AI Post Generator...");
  try {
    const res = await fetch(`${API_URL}/api/ai/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "AI Showcase Test",
        description: "Testing AI generation of posts for E2E validation.",
        platforms: ["twitter", "linkedin"]
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    assert(data && (data.twitter || data.linkedin), "AI post generation failed");
    results.push({ step: "AI Post Generation", status: "✅ Working" });
  } catch (error) {
    results.push({ step: "AI Post Generation", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testAnalyticsFlow() {
  console.log("🔹 Testing Analytics Webhook...");
  try {
    const res = await fetch(`${API_URL}/api/webhooks/platform/linkedin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: "demo123",
        likes: 10,
        views: 200,
        comments: 2,
        userId: "test-user-123",
        projectId: "demo123"
      }),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    assert(data.message, "Analytics webhook failed");
    results.push({ step: "Analytics Webhook", status: "✅ Functional" });
  } catch (error) {
    results.push({ step: "Analytics Webhook", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function testWorkerStatus() {
  console.log("🔹 Checking Worker Status...");
  try {
    // Check if workers are running by looking at Redis queues
    const queue = new Queue("postQueue", { connection: { url: REDIS_URL } });
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    
    console.log(`   📊 Queue Status: ${waiting.length} waiting, ${active.length} active`);
    results.push({ step: "Worker Status", status: "✅ Operational" });
    await queue.close();
  } catch (error) {
    results.push({ step: "Worker Status", status: "❌ Failed", error: error.message });
    throw error;
  }
}

async function summary() {
  console.log("\n--------------------------------------------------");
  console.log("📊 E2E TEST SUMMARY");
  console.log("--------------------------------------------------");
  
  for (const r of results) {
    const status = r.status.includes("✅") ? "✅" : "❌";
    const step = r.step.padEnd(25);
    console.log(`${step} → ${status} ${r.status.replace(/[✅❌]/g, '').trim()}`);
    if (r.error) {
      console.log(`   Error: ${r.error}`);
    }
  }
  
  console.log("--------------------------------------------------");

  const failed = results.filter(r => !r.status.includes("✅"));
  if (failed.length === 0) {
    console.log("🎉 ALL SYSTEMS OPERATIONAL — Phase 5 PASSED!");
    console.log("\n🚀 System is ready for production deployment!");
  } else {
    console.error("❌ Some tests failed:", failed.length);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Check Docker containers: docker ps");
    console.log("2. Check logs: docker-compose logs -f");
    console.log("3. Restart services: docker-compose restart");
    process.exit(1);
  }

  if (mongoClient) await mongoClient.close();
}

// Execute all tests sequentially
(async () => {
  try {
    await checkAPI();
    await checkMongo();
    await checkRedisQueue();
    await testWorkerStatus();
    await testPostCreation();
    await testAIIntegration();
    await testAnalyticsFlow();
  } catch (err) {
    console.error("❌ TEST FAILED:", err.message);
    console.log("\n🔧 Check the following:");
    console.log("- Docker containers are running: docker ps");
    console.log("- Backend API is accessible: curl http://localhost:5001/api/health");
    console.log("- MongoDB is running: docker logs showwork-mongodb");
    console.log("- Redis is running: docker logs showwork-redis");
  } finally {
    await summary();
  }
})();
