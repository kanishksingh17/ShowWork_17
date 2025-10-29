import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("Missing MONGO_URI in .env");
  process.exit(1);
}

console.log("Testing MongoDB connection...\n");
console.log("URI:", uri.replace(/\/\/.*?:.*?@/, "//***:***@"));

const client = new MongoClient(uri, {
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow invalid certs for DNS issues
  serverSelectionTimeoutMS: 10000, // Longer timeout for DNS resolution
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("\n✅ SUCCESS: Connected to MongoDB Atlas!");
  } catch (error) {
    console.error("\n❌ FAILED:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("- Check your internet connection");
    console.log("- Try disabling VPN or antivirus");
    console.log("- Verify the connection string in .env");
  } finally {
    await client.close();
  }
}

run();