#!/usr/bin/env node

/**
 * Clean Both Servers Starter
 * Starts both frontend (3000) and backend (5000) with port conflict resolution
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
    console.log(`✅ No processes found on port ${port}`);
  }
}

// Main function
async function startBothServers() {
  console.log("🚀 Starting Both Servers (Frontend + Backend)...");

  // Free all required ports (HMR disabled - no WebSocket needed)
  const ports = [3000, 5000];
  for (const port of ports) {
    if (await isPortInUse(port)) {
      console.log(`⚠️  Port ${port} is in use, attempting to free it...`);
      await killProcessOnPort(port);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("✅ All ports are free, starting servers...");

  // Start backend server
  console.log("🔧 Starting backend server on port 5000...");
  const backendProcess = spawn("node", ["server/server.js"], {
    cwd: process.cwd(),
    stdio: "inherit",
    shell: true,
  });

  // Wait a moment for backend to start
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Start frontend server
  console.log("🌐 Starting frontend server on port 3000...");
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

  // Handle process termination
  const cleanup = () => {
    console.log("\n🛑 Stopping both servers...");
    backendProcess.kill("SIGINT");
    frontendProcess.kill("SIGINT");
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  console.log("🔒 Both servers are running. Press Ctrl+C to stop both.");
  console.log("🌐 Frontend: http://localhost:3000");
  console.log("📡 Backend: http://localhost:5000");
  console.log("📱 Test OAuth: http://localhost:5000/api/auth/google");
}

// Start both servers
startBothServers().catch(console.error);
