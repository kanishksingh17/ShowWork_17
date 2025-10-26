import { createClient } from 'redis';

const url = process.argv[2];
if (!url) {
  console.error("❌ Please provide your Redis connection URL");
  process.exit(1);
}

const client = createClient({
  url,
  socket: { tls: true }
});

console.log("🔍 Testing Redis connection...");

client.on('error', (err) => console.error("❌ Redis error:", err));

await client.connect();

console.log("✅ Connected successfully!");

await client.set("test-key", "hello from ShowWork");
console.log("✅ Write operation successful!");

const value = await client.get("test-key");
console.log("✅ Read operation successful:", value);

await client.del("test-key");
console.log("✅ Test cleanup completed!");

await client.disconnect();
console.log("🎉 Redis connection test PASSED!");
