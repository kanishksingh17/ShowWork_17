#!/usr/bin/env node
import fetch from "node-fetch";

console.log("🔍 Testing Local Development Environment...");
console.log("==========================================");

// Test local backend
const LOCAL_BACKEND = "http://localhost:5001";
const PRODUCTION_BACKEND = "https://showwork-backend.onrender.com";

async function testEndpoint(url, name) {
  try {
    console.log(`\n🔹 Testing ${name}...`);
    const res = await fetch(`${url}/api/health`);
    
    if (res.ok) {
      const data = await res.json();
      console.log(`✅ ${name} is healthy!`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Response time: ${res.headers.get('x-response-time') || 'N/A'}`);
      return true;
    } else {
      console.log(`❌ ${name} returned status: ${res.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log("Testing endpoints...");
  
  const localHealthy = await testEndpoint(LOCAL_BACKEND, "Local Backend");
  const productionHealthy = await testEndpoint(PRODUCTION_BACKEND, "Production Backend");
  
  console.log("\n==========================================");
  console.log("📊 Test Results Summary:");
  console.log(`Local Backend: ${localHealthy ? '✅ Healthy' : '❌ Not running'}`);
  console.log(`Production Backend: ${productionHealthy ? '✅ Healthy' : '❌ Not deployed'}`);
  
  if (!localHealthy && !productionHealthy) {
    console.log("\n🔧 Next Steps:");
    console.log("1. Start local development: docker-compose up -d");
    console.log("2. Deploy to production: Follow deployment guide");
    console.log("3. Check Docker containers: docker ps");
  } else if (localHealthy && !productionHealthy) {
    console.log("\n🚀 Ready to deploy to production!");
    console.log("Follow the deployment guide to deploy to Render.");
  }
  
  console.log("\n==========================================");
}

main().catch(console.error);
