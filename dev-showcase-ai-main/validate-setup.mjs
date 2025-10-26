#!/usr/bin/env node
/**
 * ShowWork Setup Validation
 * Validates all connections and configurations
 */

import { MongoClient } from "mongodb";
import { Queue } from "bullmq";
import fetch from "node-fetch";

console.log("🔍 ShowWork Setup Validation");
console.log("============================");
console.log("This script will validate your ShowWork setup");
console.log("Make sure you have filled in your .env file with real credentials");
console.log("");

const results = [];

async function validateEnvironment() {
  console.log("🔹 Checking environment configuration...");
  
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_URL', 
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'OPENAI_API_KEY'
  ];
  
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName] || process.env[varName].includes('your-') || process.env[varName].includes('<')) {
      missing.push(varName);
    }
  }
  
  if (missing.length === 0) {
    console.log("✅ All environment variables configured");
    results.push({ step: "Environment", status: "✅ Configured" });
    return true;
  } else {
    console.log("❌ Missing or incomplete environment variables:");
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    results.push({ step: "Environment", status: "❌ Incomplete", missing });
    return false;
  }
}

async function validateMongoDB() {
  console.log("\n🔹 Testing MongoDB connection...");
  
  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not configured");
    results.push({ step: "MongoDB", status: "❌ Not configured" });
    return false;
  }
  
  try {
    const client = new MongoClient(process.env.DATABASE_URL);
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    await client.close();
    
    console.log("✅ MongoDB connected successfully");
    console.log(`   Found ${collections.length} collections`);
    results.push({ step: "MongoDB", status: "✅ Connected" });
    return true;
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    results.push({ step: "MongoDB", status: "❌ Failed", error: error.message });
    return false;
  }
}

async function validateRedis() {
  console.log("\n🔹 Testing Redis connection...");
  
  if (!process.env.REDIS_URL) {
    console.log("❌ REDIS_URL not configured");
    results.push({ step: "Redis", status: "❌ Not configured" });
    return false;
  }
  
  try {
    const queue = new Queue("validation-test", { 
      connection: { url: process.env.REDIS_URL },
      defaultJobOptions: { removeOnComplete: 1, removeOnFail: 1 }
    });
    
    const job = await queue.add("test", { timestamp: Date.now() });
    await queue.close();
    
    console.log("✅ Redis connected successfully");
    console.log(`   Job ID: ${job.id}`);
    results.push({ step: "Redis", status: "✅ Connected" });
    return true;
  } catch (error) {
    console.log("❌ Redis connection failed:", error.message);
    results.push({ step: "Redis", status: "❌ Failed", error: error.message });
    return false;
  }
}

async function validateOAuth() {
  console.log("\n🔹 Testing OAuth configuration...");
  
  const oauthVars = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET'
  ];
  
  const missing = oauthVars.filter(varName => 
    !process.env[varName] || process.env[varName].includes('your-') || process.env[varName].includes('<')
  );
  
  if (missing.length === 0) {
    console.log("✅ OAuth credentials configured");
    console.log("   GitHub OAuth: Ready");
    console.log("   Google OAuth: Ready");
    results.push({ step: "OAuth", status: "✅ Configured" });
    return true;
  } else {
    console.log("❌ OAuth credentials incomplete:");
    missing.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    results.push({ step: "OAuth", status: "❌ Incomplete", missing });
    return false;
  }
}

async function validateAI() {
  console.log("\n🔹 Testing AI configuration...");
  
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-')) {
    console.log("❌ OPENAI_API_KEY not configured");
    results.push({ step: "AI", status: "❌ Not configured" });
    return false;
  }
  
  console.log("✅ OpenAI API key configured");
  console.log(`   Key: ${process.env.OPENAI_API_KEY.substring(0, 10)}...`);
  results.push({ step: "AI", status: "✅ Configured" });
  return true;
}

async function summary() {
  console.log("\n============================");
  console.log("📊 Setup Validation Summary");
  console.log("============================");
  
  for (const result of results) {
    const status = result.status.includes("✅") ? "✅" : "❌";
    const step = result.step.padEnd(15);
    console.log(`${step} → ${status} ${result.status.replace(/[✅❌]/g, '').trim()}`);
    
    if (result.missing) {
      console.log(`   Missing: ${result.missing.join(', ')}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log("============================");
  
  const failed = results.filter(r => !r.status.includes("✅"));
  
  if (failed.length === 0) {
    console.log("🎉 All systems ready for deployment!");
    console.log("\n🚀 Next steps:");
    console.log("1. Deploy to Render using render.yaml");
    console.log("2. Configure environment variables in Render");
    console.log("3. Test your live application");
  } else {
    console.log(`❌ ${failed.length} validation checks failed`);
    console.log("\n🔧 Please fix the issues above before deploying");
    console.log("1. Update your .env file with real credentials");
    console.log("2. Run this validation again");
    console.log("3. Deploy to Render once all checks pass");
  }
}

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Run all validations
(async () => {
  try {
    await validateEnvironment();
    await validateMongoDB();
    await validateRedis();
    await validateOAuth();
    await validateAI();
  } catch (error) {
    console.error("❌ Validation failed:", error.message);
  } finally {
    await summary();
  }
})();
