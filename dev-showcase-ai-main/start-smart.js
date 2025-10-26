#!/usr/bin/env node

/**
 * Smart Server Starter
 * Automatically kills existing servers and starts fresh ones
 * No more "port already in use" errors!
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

// Function to kill ALL processes on specific ports
async function killAllProcessesOnPorts(ports) {
  console.log("🔍 Checking for existing servers...");

  for (const port of ports) {
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
            `🛑 Found ${pids.size} process(es) on port ${port}: ${Array.from(pids).join(", ")}`,
          );
          for (const pid of pids) {
            try {
              await execAsync(`taskkill /PID ${pid} /F`);
              console.log(`✅ Killed process ${pid} on port ${port}`);
            } catch (err) {
              console.log(`⚠️  Could not kill process ${pid}: ${err.message}`);
            }
          }
        } else {
          console.log(`✅ Port ${port} is free`);
        }
      } else {
        console.log(`✅ Port ${port} is free`);
      }
    } catch (error) {
      console.log(`✅ Port ${port} is free`);
    }
  }

  // Wait a moment for processes to fully terminate
  console.log("⏳ Waiting for processes to terminate...");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

// Function to start backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log("🔧 Starting backend server on port 5000...");

    const backendProcess = spawn("node", ["server/server.js"], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    });

    backendProcess.on("error", (error) => {
      console.error("❌ Failed to start backend server:", error);
      reject(error);
    });

    backendProcess.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Backend server exited with code ${code}`);
      }
    });

    // Wait a moment for backend to start
    setTimeout(() => {
      resolve(backendProcess);
    }, 3000);
  });
}

// Function to start frontend server
function startFrontend() {
  return new Promise((resolve, reject) => {
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

    frontendProcess.on("error", (error) => {
      console.error("❌ Failed to start frontend server:", error);
      reject(error);
    });

    frontendProcess.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Frontend server exited with code ${code}`);
      }
    });

    resolve(frontendProcess);
  });
}

// Main function
async function startSmart() {
  console.log("🚀 Smart Server Starter - Auto-killing existing servers...");

  // Kill all existing processes on our ports
  await killAllProcessesOnPorts([3000, 5000]);

  // Verify ports are free
  const port3000InUse = await isPortInUse(3000);
  const port5000InUse = await isPortInUse(5000);

  if (port3000InUse || port5000InUse) {
    console.log(
      "❌ Ports still in use after cleanup. Please restart your terminal and try again.",
    );
    process.exit(1);
  }

  console.log("✅ All ports are free, starting fresh servers...");

  try {
    // Start backend first
    const backendProcess = await startBackend();

    // Start frontend
    const frontendProcess = await startFrontend();

    // Handle process termination
    const cleanup = () => {
      console.log("\n🛑 Stopping all servers...");
      backendProcess.kill("SIGINT");
      frontendProcess.kill("SIGINT");
      process.exit(0);
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);

    console.log("🎉 Both servers started successfully!");
    console.log("🌐 Frontend: http://localhost:3000");
    console.log("📡 Backend: http://localhost:5000");
    console.log("📱 Test OAuth: http://localhost:5000/api/auth/google");
    console.log("💡 Press Ctrl+C to stop both servers");
  } catch (error) {
    console.error("❌ Failed to start servers:", error);
    process.exit(1);
  }
}

// Start the smart server
startSmart().catch(console.error);
