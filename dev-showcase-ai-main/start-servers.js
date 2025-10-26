#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("🚀 Starting ShowWork Development Servers...\n");

// Start Backend Server (Port 5000)
console.log("📡 Starting Backend Server on port 5000...");
const backendProcess = spawn("node", ["server/server.js"], {
  stdio: "inherit",
  cwd: __dirname,
  shell: true,
});

backendProcess.on("error", (error) => {
  console.error("❌ Backend server failed to start:", error);
});

// Wait a moment for backend to start
setTimeout(() => {
  // Start Frontend Server (Port 3000)
  console.log("\n🌐 Starting Frontend Server on port 3000...");
  const frontendProcess = spawn("npm", ["run", "dev"], {
    stdio: "inherit",
    cwd: __dirname,
    shell: true,
  });

  frontendProcess.on("error", (error) => {
    console.error("❌ Frontend server failed to start:", error);
  });

  // Handle process termination
  const shutdown = () => {
    console.log("\n🛑 Shutting down servers...");
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}, 2000);

console.log("\n✅ Servers starting...");
console.log("📡 Backend: http://localhost:5000");
console.log("🌐 Frontend: http://localhost:3000");
console.log("\n💡 Press Ctrl+C to stop both servers");
