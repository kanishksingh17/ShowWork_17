#!/usr/bin/env node
/**
 * MongoDB Connection Test
 * Tests your MongoDB Atlas connection
 */

import { MongoClient } from "mongodb";

// Get MongoDB URI from environment or prompt
const MONGO_URI = process.env.MONGO_URI || process.argv[2];

if (!MONGO_URI) {
  console.log("❌ MongoDB URI not provided");
  console.log("Usage: node test-mongodb-connection.mjs <your-mongodb-uri>");
  console.log("Or set MONGO_URI environment variable");
  process.exit(1);
}

console.log("🔍 Testing MongoDB Atlas Connection...");
console.log("=====================================");
console.log("URI:", MONGO_URI.replace(/\/\/.*@/, "//***:***@")); // Hide credentials

async function testConnection() {
  let client;
  
  try {
    console.log("\n🔹 Connecting to MongoDB Atlas...");
    client = new MongoClient(MONGO_URI);
    
    // Connect to the database
    await client.connect();
    console.log("✅ Connected successfully!");
    
    // Test database operations
    const db = client.db();
    console.log("✅ Database accessible");
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections`);
    
    // Test write operation
    const testCollection = db.collection('test');
    const testDoc = { 
      test: true, 
      timestamp: new Date(),
      message: "ShowWork MongoDB test successful!"
    };
    
    const result = await testCollection.insertOne(testDoc);
    console.log("✅ Write operation successful");
    console.log(`   Document ID: ${result.insertedId}`);
    
    // Test read operation
    const foundDoc = await testCollection.findOne({ _id: result.insertedId });
    console.log("✅ Read operation successful");
    console.log(`   Document: ${JSON.stringify(foundDoc, null, 2)}`);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log("✅ Test cleanup completed");
    
    console.log("\n🎉 MongoDB Atlas connection test PASSED!");
    console.log("Your database is ready for ShowWork deployment!");
    
  } catch (error) {
    console.error("\n❌ MongoDB connection test FAILED:");
    console.error("Error:", error.message);
    
    if (error.message.includes("authentication failed")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your username and password");
      console.log("- Ensure the user has read/write permissions");
    } else if (error.message.includes("network")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your network access settings");
      console.log("- Ensure 0.0.0.0/0 is whitelisted");
    } else if (error.message.includes("timeout")) {
      console.log("\n🔧 Troubleshooting:");
      console.log("- Check your connection string");
      console.log("- Verify the cluster is running");
    }
    
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log("✅ Connection closed");
    }
  }
}

// Run the test
testConnection().catch(console.error);
