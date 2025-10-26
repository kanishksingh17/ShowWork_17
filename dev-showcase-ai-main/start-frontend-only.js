#!/usr/bin/env node

/**
 * Custom Frontend Server Starter
 * Starts only the frontend server on port 3000
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
async function startFrontend() {
  console.log("🚀 Starting Frontend Server Only...");

  // Check and free port 3000
  if (await isPortInUse(3000)) {
    console.log("⚠️  Port 3000 is in use, attempting to free it...");
    await killProcessOnPort(3000);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
  }

  // HMR disabled - no WebSocket port needed

  // Check if ports are still in use
  if (await isPortInUse(3000)) {
    console.log(
      "❌ Port 3000 is still in use. Please manually stop the process and try again.",
    );
    console.log("💡 Run: netstat -ano | findstr :3000");
    console.log("💡 Then: taskkill /PID <PID> /F");
    process.exit(1);
  }

  console.log("✅ Port 3000 is free, starting frontend server...");

  // Start the frontend server with explicit port configuration
  const frontendProcess = spawn(
    "npx",
    [
      "vite",
      "--port",
      "3000",
      "--host",
      "localhost",
      "--strict-port",
      "--force",
    ],
    {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
      env: {
        ...process.env,
        VITE_PORT: "3000",
      },
    },
  );

  frontendProcess.on("error", (error) => {
    console.error("❌ Failed to start frontend server:", error);
    process.exit(1);
  });

  frontendProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`❌ Frontend server exited with code ${code}`);
    } else {
      console.log("✅ Frontend server stopped gracefully");
    }
  });

  // Handle process termination
  process.on("SIGINT", () => {
    console.log("\n🛑 Stopping frontend server...");
    frontendProcess.kill("SIGINT");
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("\n🛑 Stopping frontend server...");
    frontendProcess.kill("SIGTERM");
    process.exit(0);
  });

  console.log("🔒 Frontend server is running. Press Ctrl+C to stop.");
  console.log("🌐 Frontend: http://localhost:3000");
  console.log("📡 Backend should be running on: http://localhost:5000");
}

// Start the frontend
startFrontend().catch(console.error);
