#!/usr/bin/env node
/**
 * Redis Connection Test
 * Tests your Upstash Redis connection
 */

import { Queue } from "bullmq";

// Get Redis URL from environment or prompt
const REDIS_URL = process.env.REDIS_URL || process.argv[2];

if (!REDIS_URL) {
  console.log("❌ Redis URL not provided");
  console.log("Usage: node test-redis-connection.mjs <your-redis-url>");
  console.log("Or set REDIS_URL environment variable");
  process.exit(1);
}

console.log("🔍 Testing Upstash Redis Connection...");
console.log("====================================");
console.log("URL:", REDIS_URL.replace(/\/\/.*@/, "//***:***@")); // Hide credentials

async function testConnection() {
  let queue;
  
  try {
    console.log("\n🔹 Connecting to Redis...");
    
    // Create a test queue
    queue = new Queue("test-queue", { 
      connection: { url: REDIS_URL },
      defaultJobOptions: { 
        removeOnComplete: 1, 
        removeOnFail: 1 
      }
    });
    
    console.log("✅ Redis connection successful!");
    
    // Test job creation
    console.log("🔹 Testing job creation...");
    const job = await queue.add("test-job", { 
      message: "ShowWork Redis test successful!",
      timestamp: new Date().toISOString()
    });
    
    console.log("✅ Job created successfully!");
    console.log(`   Job ID: ${job.id}`);
    
    // Test job processing
    console.log("🔹 Testing job processing...");
    const jobData = await job.getState();
    console.log("✅ Job state retrieved successfully!");
    console.log(`   Job State: ${jobData}`);
    
    // Test queue stats
    console.log("🔹 Testing queue statistics...");
    const waiting = await queue.getWaiting();
    const active = await queue.getActive();
    const completed = await queue.getCompleted();
    const failed = await queue.getFailed();
    
    console.log("✅ Queue statistics retrieved!");
    console.log(`   Waiting: ${waiting.length}`);
    console.log(`   Active: ${active.length}`);
    console.log(`   Completed: ${completed.length}`);
    console.log(`   Failed: ${failed.length}`);
    
    // Clean up
    await queue.obliterate();
    console.log("✅ Test cleanup completed");
    
    console.log("\n🎉 Redis connection test PASSED!");
    console.log("Your Redis queue is ready for ShowWork deployment!");
    
  } catch (error) {
    console.error("\n❌ Redis connection test FAILED:");
    console.error("Error:", error.message);
    
    if (error.message.includes("authentication")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your Redis password");
      console.log("- Verify the connection URL format");
    } else if (error.message.includes("network")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your internet connection");
      console.log("- Verify the Redis endpoint URL");
    } else if (error.message.includes("timeout")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your Redis region selection");
      console.log("- Verify the connection string");
    }
    
    process.exit(1);
  } finally {
    if (queue) {
      await queue.close();
      console.log("✅ Connection closed");
    }
  }
}

// Run the test
testConnection().catch(console.error);
