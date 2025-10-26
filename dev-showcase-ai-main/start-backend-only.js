#!/usr/bin/env node

/**
 * Custom Backend Server Starter
 * Starts only the backend server on port 5000
 * Avoids port conflicts by checking and freeing ports first
 */

import { spawn } from "child_process";
import net from "net";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Function to check if port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once("close", () => {
        resolve(false);
      });
      server.close();
    });
    server.on("error", () => {
      resolve(true);
    });
  });
}

// Function to kill process on port
async function killProcessOnPort(port) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    if (stdout) {
      const lines = stdout.trim().split("\n");
      const pids = new Set();
      lines.forEach((line) => {
        const match = line.match(/\s+(\d+)$/);
        if (match) {
          pids.add(match[1]);
        }
      });

      if (pids.size > 0) {
        console.log(
          `🔍 Found processes on port ${port}: ${Array.from(pids).join(", ")}`,
        );
        for (const pid of pids) {
          try {
            await execAsync(`taskkill /PID ${pid} /F`);
            console.log(`✅ Killed process ${pid} on port ${port}`);
          } catch (err) {
            console.log(`⚠️  Could not kill process ${pid}: ${err.message}`);
          }
        }
      }
    }
  } catch (error) {
    // No processes found on port, which is fine
    console.log(`✅ No processes found on port ${port}`);
  }
}

// Main function
async function startBackend() {
  console.log("🚀 Starting Backend Server Only...");

  // Check and free port 5000
  if (await isPortInUse(5000)) {
    console.log("⚠️  Port 5000 is in use, attempting to free it...");
    await killProcessOnPort(5000);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
  }

  // Check if port is still in use
  if (await isPortInUse(5000)) {
    console.log(
      "❌ Port 5000 is still in use. Please manually stop the process and try again.",
    );
    console.log("💡 Run: netstat -ano | findstr :5000");
    console.log("💡 Then: taskkill /PID <PID> /F");
    process.exit(1);
  }

  console.log("✅ Port 5000 is free, starting backend server...");

  // Start the backend server
  const backendProcess = spawn("node", ["server/server.js"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  backendProcess.on("error", (error) => {
    console.error("❌ Failed to start backend server:", error);
    process.exit(1);
  });

  backendProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`❌ Backend server exited with code ${code}`);
    } else {
      console.log("✅ Backend server stopped gracefully");
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Stopping backend server...");
    backendProcess.kill("SIGINT");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Stopping backend server...");
    backendProcess.kill("SIGTERM");
    process.exit(0);
  });

  console.log("🔒 Backend server is running. Press Ctrl+C to stop.");
  console.log("📡 Backend API: http://localhost:5000");
  console.log("📱 Test OAuth: http://localhost:5000/api/auth/google");
}

// Start the backend
startBackend().catch(console.error);
